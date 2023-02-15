import mongoose from 'mongoose';
import validator from 'validator';

import {TMovie} from '../services/types';

import {
  MISSING_IMAGE_URL,
  MISSING_POSTER_URL,
  MISSING_TRAILER_URL,
  INCORRECT_RU_NAME,
  INCORRECT_EN_NAME,
} from '../utils/request-messanges';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    require: true,
  },
  director: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
  year: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  image: {
    url: {
      type: String,
      require: true,
      validate: {
        validator: (val: string) => validator.isURL(val),
        message: MISSING_POSTER_URL,
      },
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isURL(val),
      message: MISSING_TRAILER_URL,
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isURL(val),
      message: MISSING_IMAGE_URL,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  id: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, 'ru-RU', { ignore: /[a-zA-Z\s,—&\-:.%"«»'!?]/g }),
      message: INCORRECT_RU_NAME,
    },
  },
  nameEN: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, undefined, { ignore: /[\s,—&\-:.%"«»'!?]/g }),
      message: INCORRECT_EN_NAME,
    },
  },
});

export default mongoose.model<TMovie>('movie', movieSchema);
