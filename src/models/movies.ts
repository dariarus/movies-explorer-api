import mongoose from 'mongoose';
import validator from 'validator';
import {TMovie, TUser} from '../services/types';

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
    required: true,
  },
  movieId: {
  type: mongoose.Schema.Types.ObjectId,
    ref: 'movie',
    required: true,
},
  nameRU: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, 'ru-RU'),
      message: 'Введено некорректное русскоязычное название фильма',
    },
  },
  nameEN: {
    type: String,
    require: true,
    validate: {
      validator: (val: string) => validator.isAlphanumeric(val, 'en-US'),
      message: 'Введено некорректное англоязычное название фильма',
    },
  }
})

export default mongoose.model<TMovie>('user', movieSchema);