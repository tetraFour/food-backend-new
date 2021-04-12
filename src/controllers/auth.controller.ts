import * as express from 'express';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { IControllerBase } from '../interfaces';

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

    this.router.post(`${this.path}/login`, this.loginAdminPanel);
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

  private loginAdminPanel = async (req: Request, res: Response) => {
    const { login, password } = req.body;
    try {
      const user = await User.findOne({ username: login });

      if (!user) {
        return res.status(400).json({ message: 'пользователь не найден' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ message: 'неверный пароль! попробуйте снова.' });
      }

      const token = jwt.sign(
        { login: user.username, userId: user.id },
        <string>process.env.JWT_SECRET,
      );
      return res
        .status(200)
        .cookie('ut', `${token}`, { maxAge: 99999999, httpOnly: true })
        .json(user);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'что-то пошло не так! попробуйте снова.' });
    }
  };
}

export default AuthController;
