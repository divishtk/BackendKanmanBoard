import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'Task Manager',
      link: 'https://google.com',
    },
  });

  //generate plantext of email for browser that doesnot support HTML
  var emailText = mailGenerator.generatePlaintext(options.mailGenContent);
  var emailText = mailGenerator.generate(options.mailGenContent);

  const mailTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10),
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mail = {
    from: process.env.SMTP_EMAIL,
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailText,
  };

  try {
    await mailTransporter.sendMail(mail);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const emailVerificationMailGenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: 'Welcome to Task Manager! We are excited to have you on board.',
      action: {
        instructions:
          'To get started with your account, please verify your email address by clicking the button below:',
        button: {
          color: '#22BC66',
          text: 'Verify your email address',
          link: verificationUrl,
        },
      },
      outro: 'Need help please contact us further!',
    },
  };
};




const forgotPasswordMailGenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: 'We got a request to reset your password.',
      action: {
        instructions: 'To reset your password, please click the button below:',
        button: {
          color: '#22BC66',
          text: 'Reset your password',
          link: passwordResetUrl,
        },
      },
      outro: 'Need help please contact us further!',
    },
  };
};

// sendMail({
//   email: user.email,
//   subject: 'Verify!',
//   mailGenContent: emailVerificationMailGenContent(
//     user.username,
//     verificationUrl,
//   ),
// });

export {
  emailVerificationMailGenContent,
  forgotPasswordMailGenContent,
  sendMail,
};
