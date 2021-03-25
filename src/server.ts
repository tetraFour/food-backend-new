import './config/environment.config';
import './config/cloudinary.config';

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import path from 'path';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import partials from 'express-partials';

import App from './app';
import { LoggerMiddleware } from './middleware';
import { AuthController, UserController, PagesController } from './controllers';
import { PassportConfig } from './config/passport.config';

const app = new App({
  port: parseInt(process.env.PORT) || 5000,
  middlewares: [
    express.json({ limit: '50mb' }),
    express.urlencoded({ extended: true }),
    express.static(path.join(__dirname, 'public')),
    LoggerMiddleware,
    cors({
      origin: process.env.DEVELOPMENT,
    }),
    session({
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
    }),
    cookieParser(),
    partials(),
    passport.initialize(),
    passport.session(),
  ],
  setters: [
    { name: 'views', description: path.join(__dirname, 'views') },
    { name: 'view engine', description: 'ejs' },
  ],
  controllers: [
    new AuthController(),
    new UserController(),
    new PagesController(),
  ],
});

new PassportConfig();

app.listen();
