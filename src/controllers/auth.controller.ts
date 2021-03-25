import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import passport from 'passport';
import { IUserModel } from '~/models/user.model';

import { User } from '../models';
import { IControllerBase } from '../interfaces';
import { signInValidation, signUpValidation } from '../validations';

class AuthController implements IControllerBase {
  public path = '/api/auth';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.post(
      `/signup`,
      this.signUp,
      passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true,
      }),
    );
    this.router.post(
      `/login`,
      passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/signup',
        failureFlash: true,
      }),
    );
    this.router.get('/logout', this.logout);
  };

  private signUp = async (req: Request, res: Response) => {
    try {
      const username = req.body.user;
      const password = req.body.pass;
      const email = req.body.email;

      const user = await User.findOne({
        username: username,
      });
      if (user) {
        return res.redirect('/signup');
      }

      const newUser = new User({
        username: username,
        password: password,
        email: email,
        role: 1,
      });
      await newUser.save();

      return res.redirect('/');
    } catch (e) {
      console.log(e);
    }
  };

  private logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect('/');
  };
}

export default AuthController;
