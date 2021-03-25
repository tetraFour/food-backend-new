import express from 'express';
import { Product, Restaurant } from '../models';

const finalProducts = async (
  productType: string,
  page: string,
  req: express.Request,
  res: express.Response,
) => {
  const finalProductsList = [];
  const products = await Product.find({ type: productType }).populate(
    'restaurantId',
  );

  const restaurants = await Restaurant.find();
  console.log(products);
  for (let product = 0; product < products.length; product++) {
    if (
      req.user &&
      // @ts-ignore
      req.user.role === 3 &&
      products[product].restaurantId.user &&
      // @ts-ignore
      String(products[product].restaurantId.user) === String(req.user._id)
    ) {
      finalProductsList.push(products[product]);
    }
  }
  // @ts-ignore
  if (req.user && req.user.role === 3) {
    return res.render(page, {
      products: finalProductsList,
      restaurants,
    });
  }
  return res.render(page, {
    products: products,
    restaurants,
  });
};

export default finalProducts;
