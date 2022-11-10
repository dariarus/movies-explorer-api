"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_401_unauthorized_1 = __importDefault(require("../errors/error-401-unauthorized"));
const { NODE_ENV, JWT_SECRET } = process.env;
const INCORRECT_TOKEN_MESSAGE = 'Ошибка авторизации';
function auth(req, res, next) {
    const token = req.cookies.jwt;
    if (!token) {
        next(new error_401_unauthorized_1.default(INCORRECT_TOKEN_MESSAGE));
        return;
    }
    let payload;
    try {
        payload = jsonwebtoken_1.default.verify(token, NODE_ENV === 'production' ? `${JWT_SECRET}` : 'dev-secret');
    }
    catch (err) {
        next(err);
        return;
    }
    req.user = payload;
    next();
}
exports.default = auth;
