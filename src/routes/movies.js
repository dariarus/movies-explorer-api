"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const movies_1 = require("../controllers/movies");
const constants_1 = require("../utils/constants");
const router = (0, express_1.Router)();
router.get('/', movies_1.getMovies);
router.post('/', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        country: celebrate_1.Joi.string().required(),
        director: celebrate_1.Joi.string().required(),
        duration: celebrate_1.Joi.number().required(),
        year: celebrate_1.Joi.string().required(),
        description: celebrate_1.Joi.string().required(),
        image: celebrate_1.Joi.string().required().custom(constants_1.validateURL, 'custom URL validation'),
        trailerLink: celebrate_1.Joi.string().required().custom(constants_1.validateURL, 'custom URL validation'),
        thumbnail: celebrate_1.Joi.string().required().custom(constants_1.validateURL, 'custom URL validation'),
        // movieId: Joi.string().custom(validateId, 'custom id validation').required(),
        movieId: celebrate_1.Joi.string().required(),
        nameRU: celebrate_1.Joi.string().regex(constants_1.NAME_RU_REGEX).required(),
        nameEN: celebrate_1.Joi.string().regex(constants_1.NAME_EN_REGEX).required(),
    }),
}), movies_1.saveMovie);
router.delete('/:id', (0, celebrate_1.celebrate)({
    params: celebrate_1.Joi.object().keys({
        id: celebrate_1.Joi.string().custom(constants_1.validateId, 'custom id validation'),
    }),
}), movies_1.unsaveMovie);
exports.default = router;
