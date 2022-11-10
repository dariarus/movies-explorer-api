import mongoose from 'mongoose';
import validator from 'validator';
import { TUser } from '../services/types';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неверный формат электронного адреса',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<TUser>('user', userSchema);
