import mongoose from 'mongoose';
import validator from 'validator';
import { TMovie } from '../services/types';

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
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isURL(val),
      message: 'Укажите ссылку на постер к фильму',
    },
  },
  trailerLink: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isURL(val),
      message: 'Укажите ссылку на трейлер фильма',
    },
  },
  thumbnail: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isURL(val),
      message: 'Укажите ссылку на миниатюру постера к фильму',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  movieId: {
    type: Number,
    required: true,
    // cast: false,
  },
  nameRU: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, 'ru-RU', { ignore: ' -:' }),
      message: 'Введено некорректное русскоязычное название фильма',
    },
  },
  nameEN: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, 'en-US', { ignore: ' -:' }),
      message: 'Введено некорректное англоязычное название фильма',
    },
  },
});

export default mongoose.model<TMovie>('movie', movieSchema);
