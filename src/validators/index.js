import { body } from 'express-validator';

const userRegisterationValidator = () => {

    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),
        body('username')
            .trim()
            .notEmpty()
            .withMessage('Username is required')
            .isLength({ min: 3 })
            .withMessage('Username must be at least 3 characters long')
            .isLength({ max: 20 })
            .withMessage('Username must be at most 20 characters long'),

    ]
}


const userLoginValidator = () => {

    return [
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Email is not valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password is required')
    ]
}   


const createProjectValidator = () =>{
     return [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Project Name is required'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('Project Description is required')
    ]
}

export { userRegisterationValidator ,userLoginValidator , createProjectValidator}