import { Document, Schema, ObjectId, model } from 'mongoose';

export interface IRestaurantModel extends Document {
  _id: string;
  name: string;
  user: ObjectId;
  site?: string;
}

const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  site: {
    type: String,
    // required: true
  },
});

const Restaurant = model<IRestaurantModel>('Restaurant', restaurantSchema);

export default Restaurant;
