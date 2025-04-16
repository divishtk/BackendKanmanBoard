import app from './src/app.js';
import dotenv from 'dotenv';
import connectDB from './src/db/index.js';

dotenv.config({
  path: './.env',
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
