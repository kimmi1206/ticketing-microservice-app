import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { RequestValidationError } from '../errors/request-validation-error';
import { DatabaseConnectionError } from '../errors/database-connection-error';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email') // .isEmail()
      .isEmail()
      .withMessage('Please enter a valid email address'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Please enter a password between 4 and 20 characters'),
    // body('confirmPassword')
    //   .trim()
    //   .custom((value, { req }) => {
    //     if (value !== req.body.password) {
    //       throw new Error('Passwords do not match');
    //     }
    //     return true;
    //   })
    //   .withMessage('Passwords do not match'),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());

      //  --other examples
      // return res.status(400).json({ errors: errors.array() });
      //return res.status(400).send(errors.array());
      // const error = new Error('Invalid Email or Password');
      // error.reasons = errors.array();
      // throw error;
    }
    const { email, password } = req.body;
    console.log('Creating user with email: ' + email);
    throw new DatabaseConnectionError();

    res.send({});
  }
);

export { router as signupRouter };
