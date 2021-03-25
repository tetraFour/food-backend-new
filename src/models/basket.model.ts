import mongoose, { Document, model, ObjectId, Schema } from 'mongoose';

export interface IBasketModel extends Document {
  _id: string;
  userId: ObjectId;
  productId: ObjectId;
  orderTime?: Date;
}

const basketSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  orderTime: {
    type: mongoose.Schema.Types.Date,
  },
});

const Basket = model<IBasketModel>('Basket', basketSchema);

export default Basket;
