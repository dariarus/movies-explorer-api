"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const celebrate_1 = require("celebrate");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const mongodb_1 = require("mongodb");
const auth_1 = __importDefault(require("./middlewares/auth"));
const users_1 = __importDefault(require("./routes/users"));
const movies_1 = __importDefault(require("./routes/movies"));
const auth_2 = require("./controllers/auth");
const error_404_not_found_1 = __importDefault(require("./errors/error-404-not-found"));
const error_400_bad_request_1 = __importDefault(require("./errors/error-400-bad-request"));
const error_401_unauthorized_1 = __importDefault(require("./errors/error-401-unauthorized"));
const error_403_forbidden_1 = __importDefault(require("./errors/error-403-forbidden"));
const error_409_conflict_1 = __importDefault(require("./errors/error-409-conflict"));
const error_500_internal_server_error_1 = __importDefault(require("./errors/error-500-internal-server-error"));
const logger_1 = require("./middlewares/logger");
require('dotenv').config();
const { PORT = 3000 } = process.env;
const runApp = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, cookie_parser_1.default)());
    // Логер запросов до всех роутов
    app.use(logger_1.requestLogger);
    // Роуты регистрации и авторизации
    app.post('/signup', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object().keys({
            email: celebrate_1.Joi.string().required().email(),
            password: celebrate_1.Joi.string().required().min(4),
            name: celebrate_1.Joi.string().min(2).max(30),
        }),
    }), auth_2.createUser);
    app.post('/signin', (0, celebrate_1.celebrate)({
        body: celebrate_1.Joi.object().keys({
            email: celebrate_1.Joi.string().required().email(),
            password: celebrate_1.Joi.string().required().min(4),
        }),
    }), auth_2.login);
    // Защита роутов авторизацией
    app.use(auth_1.default);
    app.use('/users', users_1.default);
    app.use('/movies', movies_1.default);
    app.post('/signout', auth_2.logout);
    // Логер ошибок после роутов и до обработки ошибок
    app.use(logger_1.errorLogger);
    // Обработчик ошибок celebrate
    app.use((0, celebrate_1.errors)());
    // Мидлвар централизованной обработки ошибок
    app.use((err, req, res, next) => {
        console.log(err);
        let statusCode;
        let message;
        if (err instanceof error_404_not_found_1.default
            || err instanceof error_400_bad_request_1.default
            || err instanceof error_401_unauthorized_1.default
            || err instanceof error_403_forbidden_1.default) {
            ({ statusCode, message } = err);
        }
        else if (err instanceof mongoose_1.default.Error.CastError
            || err instanceof mongoose_1.default.Error.ValidationError) {
            statusCode = error_400_bad_request_1.default.DEFAULT_STATUS_CODE;
            message = error_400_bad_request_1.default.DEFAULT_MESSAGE;
        }
        else if (err.name === 'JsonWebTokenError') {
            statusCode = error_401_unauthorized_1.default.DEFAULT_STATUS_CODE;
            message = 'Ошибка авторизации';
        }
        else if (err instanceof mongodb_1.MongoServerError && err.code === 11000) {
            statusCode = error_409_conflict_1.default.DEFAULT_STATUS_CODE;
            message = error_409_conflict_1.default.DEFAULT_MESSAGE;
        }
        else {
            statusCode = error_500_internal_server_error_1.default.DEFAULT_STATUS_CODE;
            message = error_500_internal_server_error_1.default.DEFAULT_MESSAGE;
        }
        res
            .status(statusCode)
            .send({
            message,
        });
        next();
    });
    app.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
};
// перед запуском приложения проверяется соединение с БД
mongoose_1.default.connect('mongodb://root:example@localhost:27017/moviesdb?authSource=admin', (err) => {
    if (err) {
        console.error('FAILED TO CONNECT TO MONGODB');
        console.error(err);
    }
    else {
        console.log('CONNECTED TO MONGODB');
    }
    runApp();
});
