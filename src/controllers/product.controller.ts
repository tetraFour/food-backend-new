import * as express from 'express';
import { Request, Response } from 'express';
import { cloudinary } from '../config/cloudinary.config';

import { Product, Restaurant } from '../models';
import { IControllerBase } from '../interfaces';

class ProductController implements IControllerBase {
  public path = '/api/product';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes = (): void => {
    this.router.delete(`${this.path}/:id`, this.deleteProduct);
    this.router.get(`${this.path}/get-products`, this.getProducts);
    this.router.post(`${this.path}`, this.createProduct);
    this.router.patch(`${this.path}/:id`, this.updateProduct);
    this.router.get(`${this.path}/:id`, this.getCurrentProduct);
  };

  private getProducts = async (req: Request, res: Response) => {
    try {
      const food = await Product.find().populate('restaurantId');
      return res.status(200).send(food);
    } catch (e) {
      console.log(e);
    }
  };

  private getCurrentProduct = async (req: Request, res: Response) => {
    try {
      const food = await Product.findById(req.params.id).populate(
        'restaurantId',
      );
      return res.status(200).send(food);
    } catch (e) {
      console.log(e);
    }
  };

  private deleteProduct = async (req: Request, res: Response) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product) {
        return res.status(200).send('ok');
      }
    } catch (e) {
      console.log(e);
    }
  };
  private createProduct = async (req: Request, res: Response) => {
    try {
      const { name, file, price, restaurantId, type, time } = req.body;
      console.log(name);

      const restaurant = await Restaurant.findOne({ name: restaurantId });

      const data = await cloudinary.uploader.upload(file, {});
      const imageOrientation =
        data.width > data.height ? 'horizontal' : 'vertical';

      const food = new Product({
        name,
        price,
        restaurantId: restaurant.id,
        type,
        time,
        imageUrl: data.secure_url,
        imageOrientation,
      });

      await food.save();

      return res.status(200).send('food has been created');
    } catch (e) {
      console.log(e);
    }
  };

  private updateProduct = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { field, value } = req.body;
      await Product.findByIdAndUpdate(id, { [field]: value });
      return res.status(200).send('PATCH: OK!');
    } catch (e) {
      console.log(e);
    }
  };
}

export default ProductController;
