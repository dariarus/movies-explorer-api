import { Joi, SchemaOptions } from 'celebrate';
import { NAME_EN_REGEX, NAME_RU_REGEX, validateURL } from './constants';

// eslint-disable-next-line import/prefer-default-export
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
