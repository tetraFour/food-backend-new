import bcrypt from 'bcrypt';
import { Document, model, Schema } from 'mongoose';

const SALT_FACTOR = 10;

export interface IUserModel extends Document {
  _id: string;
  login: string;
  username: string;
  password: string;
  email: string;
  role: number;
  createdAt: Date;
  displayName: number;
  bio: string;
  checkPassword: (guess: string, done: any) => void;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: Number,
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  displayName: String,
  bio: String,
});

userSchema.methods.name = function () {
  return this.displayName || this.username;
};

userSchema.pre<IUserModel>('save', async function () {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(SALT_FACTOR);
      this.password = await bcrypt.hash(this.password, salt);
    }
  } catch (e) {
    console.log(e);
  }
});

userSchema.methods.checkPassword = async function (
  guess: string,
  done: () => void,
) {
  try {
    await bcrypt.compare(this.password, guess);
    done();
  } catch (e) {
    console.log(e);
  }
};

const User = model<IUserModel>('User', userSchema);

export default User;
