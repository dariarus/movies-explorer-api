"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.getUser = void 0;
const users_1 = __importDefault(require("../models/users"));
const error_404_not_found_1 = __importDefault(require("../errors/error-404-not-found"));
const NOT_FOUND_MESSAGE = 'Такой пользователь не существует';
// Вернуть авторизованного пользователя
const getUser = (req, res, next) => {
    users_1.default.findById(req.user)
        .then((user) => {
        if (!user) {
            next(new error_404_not_found_1.default(NOT_FOUND_MESSAGE));
            return;
        }
        res.send(user);
    })
        .catch(next);
};
exports.getUser = getUser;
// Обновить информацию о пользователе
const updateUser = (req, res, next) => {
    const { name, email, password } = req.body;
    return users_1.default.findByIdAndUpdate(req.user._id, { name, email, password }, { new: true, runValidators: true })
        .then((user) => {
        if (!user) {
            throw new error_404_not_found_1.default(NOT_FOUND_MESSAGE);
        }
        res.send(user);
    })
        .catch(next);
};
exports.updateUser = updateUser;
