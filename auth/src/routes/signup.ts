import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@khmtickets/common';

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
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // console.log('Email already in use');
      // return res.send({});
      throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY! // exclamation (Non-Null Assertion) indicates totypescript to  ignore undefined or null types
    );

    // Store it on session object
    req.session = { jwt: userJwt };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
