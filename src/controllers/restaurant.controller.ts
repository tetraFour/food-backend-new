import * as express from 'express';
import { Request, Response } from 'express';
import { IUserModel } from '../models/user.model';

import { Restaurant, User } from '../models';
import { IControllerBase } from '../interfaces';

class RestaurantController implements IControllerBase {
  public path = '/api/restaurant';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.delete(`${this.path}/:id`, this.deleteRestaurant);
    this.router.get(`${this.path}`, this.getAllRestaurants);
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
}

export default RestaurantController;
