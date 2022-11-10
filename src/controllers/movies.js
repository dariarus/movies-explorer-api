"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsaveMovie = exports.saveMovie = exports.getMovies = void 0;
const error_404_not_found_1 = __importDefault(require("../errors/error-404-not-found"));
const movies_1 = __importDefault(require("../models/movies"));
const error_403_forbidden_1 = __importDefault(require("../errors/error-403-forbidden"));
const NOT_FOUND_MESSAGE = 'Такой фильм не найден';
// Вернуть сохраненные пользователем фильмы
const getMovies = (req, res, next) => {
    movies_1.default.find({ owner: req.user._id })
        .then((movies) => {
        if (!movies) {
            res.send([]);
        }
        res.send(movies);
    })
        .catch(next);
};
exports.getMovies = getMovies;
// Сохранить фильм к себе (лайкнуть)
const saveMovie = (req, res, next) => {
    const { country, director, duration, year, description, image, trailerLink, thumbnail, movieId, nameRU, nameEN, } = req.body;
    return movies_1.default.create({
        country,
        director,
        duration,
        year,
        description,
        image,
        trailerLink,
        thumbnail,
        movieId,
        nameRU,
        nameEN,
        owner: req.user._id,
    })
        .then((movie) => {
        res.send(movie);
    })
        .catch(next);
};
exports.saveMovie = saveMovie;
// Удалить фильм из понравившихся (дизлайкнуть)
const unsaveMovie = (req, res, next) => {
    movies_1.default.findById(req.params.id)
        .then((movie) => {
        if (!movie) {
            next(new error_404_not_found_1.default(NOT_FOUND_MESSAGE));
            return;
        }
        if (String(movie.owner) !== req.user._id) {
            next(new error_403_forbidden_1.default());
            return;
        }
        movie.remove().then(() => res.send(movie)).catch(next);
    })
        .catch(next);
};
exports.unsaveMovie = unsaveMovie;
