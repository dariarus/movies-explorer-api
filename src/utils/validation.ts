import { Joi, SchemaOptions } from 'celebrate';
import {
  NAME_EN_REGEX, NAME_RU_REGEX, validateId, validateURL,
} from './constants';

export const signupReqValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
};

export const signinReqValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

export const userChangeReqValidation: SchemaOptions = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
};

export const movieCreateReqValidation: SchemaOptions = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().custom(validateURL, 'custom URL validation'),
    trailerLink: Joi.string().required().custom(validateURL, 'custom URL validation'),
    thumbnail: Joi.string().required().custom(validateURL, 'custom URL validation'),
    movieId: Joi.number().required(),
    nameRU: Joi.string().regex(NAME_RU_REGEX).required(),
    nameEN: Joi.string().regex(NAME_EN_REGEX).required(),
  }),
};

export const movieUnsaveReqValidation = {
  params: Joi.object().keys({
    id: Joi.string().custom(validateId, 'custom id validation'),
  }),
};
