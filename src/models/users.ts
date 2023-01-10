import mongoose from 'mongoose';
import validator from 'validator';

import { TUser } from '../services/types';

import { INCORRECT_EMAIL } from '../utils/request-messanges';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: INCORRECT_EMAIL,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model<TUser>('user', userSchema);
