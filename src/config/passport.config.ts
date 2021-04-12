import passport from 'passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import { User } from '../models';
import { IUserModel } from '../models/user.model';

const cookieExtract = (req: Request) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.ut;
  }
  return token;
};

const options = {
  jwtFromRequest: cookieExtract,
  secretOrKey: process.env.JWT_SECRET,
};

export class PassportConfig {
  constructor() {
    this.initPassportConfigJWT();
    this.initPassportConfigLocal();
  }

  private initPassportConfigLocal = () => {
    passport.serializeUser(function (user: IUserModel, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function (id, done) {
      User.findById(id, function (err, user) {
        done(err, user);
      });
    });

    passport.use(
      'login',
      new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username }, function (err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false, {
              message: 'No user has that username!',
            });
          }
          user.checkPassword(password, (err: any, isMatch: any) => {
            if (err) {
              return done(err);
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, user, {
                message: 'Invalid password',
              });
            }
          });
        });
      }),
    );
  };

  private initPassportConfigJWT = () =>
    passport.use(
      new Strategy(options, async (payload, done) => {
        try {
          const user = await User.findOne({ login: payload.login });
          if (user) {
            console.log('PASSPORT: user was found!');
            done(null, user);
          }
          if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
          }
        } catch (error) {
          done(null, false);
          console.log(error);
        }
      }),
    );
}

// export default new Passport();
