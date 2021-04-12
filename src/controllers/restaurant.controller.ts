import * as express from 'express';
import { Request, Response } from 'express';
import ejs from 'ejs';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid';

import { Restaurant, User } from '../models';
import { IControllerBase } from '../interfaces';
import path from 'path';

class RestaurantController implements IControllerBase {
  public path = '/api/restaurant';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.delete(`${this.path}/:id`, this.deleteRestaurant);
    this.router.get(`${this.path}`, this.getAllRestaurants);
    this.router.get(`${this.path}`, this.getCurrentRestaurant);
    this.router.post(`${this.path}/add-house`, this.addRestaurant);
  };

  private deleteRestaurant = async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
      if (restaurant) {
        return res.redirect('/tables-page');
      }
    } catch (e) {
      console.log(e);
    }
  };

  private getAllRestaurants = async (req: Request, res: Response) => {
    try {
      const restaurant = await Restaurant.find().populate('user');
      return res.status(200).send(restaurant);
    } catch (e) {
      console.log(e);
    }
  };

  private addRestaurant = async (req: Request, res: Response) => {
    try {
      const { name, address, site } = req.body;

      const findRestaurant = await Restaurant.findOne({ name });

      if (findRestaurant) {
        return res.status(403).send('restaurant has already exists');
      }

      const generateUUID = () => uuidv4();

      const user = new User({
        username: generateUUID(),
        password: generateUUID(),
        email: address,
        role: 3,
        created: new Date(),
      });

      const finalPassword = user.password;

      await user.save();

      const restaurant = new Restaurant({ name, site, user: user.id });

      await restaurant.save();

      const transporter = nodemailer.createTransport({
        service: process.env.NODEMAILER_SERVICE,
        auth: {
          user: process.env.NODEMAILER_USERNAME,
          pass: process.env.NODEMAILER_PASSWORD,
        },
      });

      const renderFile = (file: string, data: ejs.Data) => {
        return new Promise((resolve) => {
          ejs.renderFile(file, data, (err, result) => {
            if (err) {
              console.log(err);
            }
            resolve(result);
          });
        });
      };
      const template = await renderFile(
        path.resolve(__dirname, '..') + '/views/partials/email-template.ejs',
        { userLogin: user.username, userPassword: finalPassword },
      );
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: '"Food Admin 🍖" <food-admin@food-service.com>', // sender address
        to: address, // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: template, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      return res.status(200).send('ok');
    } catch (e) {
      console.log(e);
    }
  };

  private getCurrentRestaurant = async (req: Request, res: Response) => {
    try {
      const { restaurant } = req.query;
      console.log(restaurant);
      const restaurants = await Restaurant.find({
        name: { $regex: new RegExp(restaurant.toString(), 'i') },
      });
      return res.status(200).send(restaurants);
    } catch (e) {
      console.log(e);
    }
  };
}

export default RestaurantController;
