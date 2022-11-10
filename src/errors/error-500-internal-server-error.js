"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InternalServerError extends Error {
    constructor(message = InternalServerError.DEFAULT_MESSAGE) {
        super(message);
        this.statusCode = InternalServerError.DEFAULT_STATUS_CODE;
    }
    static get DEFAULT_STATUS_CODE() {
        return 500;
    }
    static get DEFAULT_MESSAGE() {
        return 'На сервере произошла ошибка';
    }
}
exports.default = InternalServerError;
