import * as express from 'express';
import { Request, Response } from 'express';
import { finalProducts } from '../utils';

import { Restaurant, User, Product, Basket } from '../models';
import { IControllerBase } from '../interfaces';

import { getHours, getMinutes } from 'date-fns';

class PagesController implements IControllerBase {
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.use((req, res, next) => {
      res.locals.currentUser = req.user || null;
      next();
    });
    this.router.get(`/`, this.homePage);
    this.router.get(`/product`, this.currentProductPage);
    this.router.get(`/about-page`, this.aboutPage);
    this.router.get(`/basket-page`, this.basketPage);
    this.router.get(`/food-page`, this.foodPage);
    this.router.get(`/bakery-page`, this.bakeryPage);
    this.router.get(`/drink-page`, this.drinkPage);
  };

  private homePage = async (req: Request, res: Response) => {
    try {
      // console.log('res.locals: ', res.locals);
      const users = await User.find().sort({
        createdAt: 'descending',
      });
      const products = await Product.find().populate('restaurantId');
      const restaurants = await Restaurant.find();
      // console.log(restaurants);
      res.render('index', {
        users,
        products: products,
        restaurants: restaurants,
      });
    } catch (e) {
      console.log(e);
    }
  };

  private currentProductPage = async (req: Request, res: Response) => {
    try {
      const productId = req.query.id;
      const product = await Product.findById(productId).populate(
        'restaurantId',
      );
      const restaurant = await Restaurant.find();

      return res.render('pages/product-page', {
        product: product,
        restaurants: restaurant,
      });
    } catch (e) {
      console.log(e);
    }
  };

  private aboutPage = async (req: Request, res: Response) => {
    try {
      const restaurants = await Restaurant.find();
      return res.render('pages/about-page', { restaurants });
    } catch (e) {
      console.log(e);
    }
  };

  private basketPage = async (req: Request, res: Response) => {
    try {
      let finalPrice = 0;
      const finalBasket = [];
      // @ts-ignore
      const basket = await Basket.find({ userId: req.user._id }).populate([
        'userId',
        'productId',
      ]);

      // console.log(req.user);

      for (let product = 0; product < basket.length; product++) {
        if (getHours(basket[product].orderTime) + 3 >= getHours(new Date())) {
          finalBasket.push(basket[product]);
        }
      }
      basket.forEach((bskt) => {
        // @ts-ignore
        finalPrice += +bskt.productId.price;
      });
      console.log(finalPrice);

      const restaurants = await Restaurant.find();
      return res.render('pages/basket-page', {
        basket: finalBasket,
        finalPrice: finalPrice,
        restaurants,
        getMinutes: getMinutes,
        getHours: getHours,
      });
    } catch (e) {
      console.log(e);
    }
  };

  private foodPage = async (req: Request, res: Response) => {
    try {
      await finalProducts('food', 'pages/food-page', req, res);
    } catch (e) {
      console.log(e);
    }
  };

  private drinkPage = async (req: Request, res: Response) => {
    try {
      await finalProducts('drink', 'pages/coffee-page', req, res);
    } catch (e) {
      console.log(e);
    }
  };

  private bakeryPage = async (req: Request, res: Response) => {
    try {
      await finalProducts('bakery', 'pages/bakery-page', req, res);
    } catch (e) {
      console.log(e);
    }
  };
}

export default PagesController;
