import * as express from 'express';
import { Request, Response } from 'express';
import { IUserModel } from '~/models/user.model';

import { Basket, User } from '../models';
import { IControllerBase } from '../interfaces';

class UserController implements IControllerBase {
  public path = '/api/user';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.get(`${this.path}/get-users`, this.getUsers);
    this.router.delete(`${this.path}/:id`, this.deleteUser);
    this.router.post(`/add-to-basket`, this.addToBasket);
    this.router.post(`/checkout`, this.clearBasket);
  };

  private getUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find();

      const availableData = users.map((user) => ({
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        role: user.role,
      }));
      res.status(200).send(availableData);
    } catch (e) {
      console.log(e);
    }
  };

  private deleteUser = async (req: Request, res: Response) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (user) {
        return res.redirect('/tables-page');
      }
    } catch (e) {
      console.log(e);
    }
  };

  private clearBasket = async (req: Request, res: Response) => {
    try {
      //@ts-ignore
      await Basket.deleteMany({ userId: req.user.id });
      return res.redirect('/basket-page');
    } catch (e) {
      console.log(e);
    }
  };

  private addToBasket = async (req: Request, res: Response) => {
    try {
      const userId = req.query.user;
      const productId = req.query.product;

      console.log(userId, productId);

      const newBasketElement = new Basket({
        userId: userId,
        productId: productId,
        orderTime: new Date(),
      });
      await newBasketElement.save();
      return res.redirect('/basket-page');
    } catch (e) {
      console.log(e);
    }
  };
}

export default UserController;
