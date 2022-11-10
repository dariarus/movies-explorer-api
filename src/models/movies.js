"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const movieSchema = new mongoose_1.default.Schema({
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
            validator: (val) => validator_1.default.isURL(val),
            message: 'Укажите ссылку на постер к фильму',
        },
    },
    trailerLink: {
        type: String,
        require: true,
        validate: {
            validator: (val) => validator_1.default.isURL(val),
            message: 'Укажите ссылку на трейлер фильма',
        },
    },
    thumbnail: {
        type: String,
        require: true,
        validate: {
            validator: (val) => validator_1.default.isURL(val),
            message: 'Укажите ссылку на миниатюру постера к фильму',
        },
    },
    owner: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    //   movieId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //     ref: 'movie',
    //     required: true,
    // },
    movieId: {
        type: String,
        required: true,
    },
    nameRU: {
        type: String,
        require: true,
        validate: {
            validator: (val) => validator_1.default.isAlphanumeric(val, 'ru-RU', { ignore: ' -:' }),
            message: 'Введено некорректное русскоязычное название фильма',
        },
    },
    nameEN: {
        type: String,
        require: true,
        validate: {
            validator: (val) => validator_1.default.isAlphanumeric(val, 'en-US', { ignore: ' -:' }),
            message: 'Введено некорректное англоязычное название фильма',
        },
    },
});
exports.default = mongoose_1.default.model('movie', movieSchema);
