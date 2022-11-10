"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("../models/users"));
const error_404_not_found_1 = __importDefault(require("../errors/error-404-not-found"));
const error_401_unauthorized_1 = __importDefault(require("../errors/error-401-unauthorized"));
const { NODE_ENV, JWT_SECRET } = process.env;
// Создать нового юзера (регистрация)
const createUser = (req, res, next) => {
    const { email, password, name, } = req.body;
    bcrypt_1.default.hash(password, 10)
        .then((hash) => users_1.default.create({
        email,
        password: hash,
        name,
    }))
        .then((user) => {
        res
            .send({
            email: user.email,
            name: user.name,
        })
            .redirect('/signin');
    })
        .catch(next);
};
exports.createUser = createUser;
// Войти в аккаунт (авторизация)
const login = (req, res, next) => {
    const { email, password } = req.body;
    return users_1.default.findOne({ email }).select('+password')
        .then((user) => {
        if (!user) {
            next(new error_404_not_found_1.default('Пользователь не найден'));
            return;
        }
        bcrypt_1.default.compare(password, user.password)
            .then((matched) => {
            if (!matched) {
                next(new error_401_unauthorized_1.default());
                return;
            }
            const token = jsonwebtoken_1.default.sign({ _id: user._id }, NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret', { expiresIn: '10d' });
            // сохранение токена в cookie
            res
                .cookie('jwt', token, {
                maxAge: 3600000 * 24,
                httpOnly: true,
                sameSite: true,
            });
            res.send({ token });
        }).catch(next);
    }).catch(next);
};
exports.login = login;
const logout = (req, res) => {
    res
        .clearCookie('jwt')
        .send('Успешный выход из аккаунта')
        .redirect('/signin');
};
exports.logout = logout;
