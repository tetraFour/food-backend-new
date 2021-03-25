import { Document, model, ObjectId, Schema } from 'mongoose';

export interface IProductModel extends Document {
  _id: string;
  name: string;
  restaurantId: any;
  price: string;
  time: number;
  type: string;
  imageUrl: string;
  imageOrientation: string;
}

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  time: {
    required: true,
    type: Number,
  },
  type: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  imageOrientation: {
    type: String,
    required: true,
  },
});

const Product = model<IProductModel>('Product', productSchema);

export default Product;
