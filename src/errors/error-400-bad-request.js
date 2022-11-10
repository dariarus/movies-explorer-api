"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BadRequestError extends Error {
    constructor(message = BadRequestError.DEFAULT_MESSAGE) {
        super(message);
        this.statusCode = BadRequestError.DEFAULT_STATUS_CODE;
    }
    static get DEFAULT_STATUS_CODE() {
        return 400;
    }
    static get DEFAULT_MESSAGE() {
        return 'Неверно сформирован запрос';
    }
}
exports.default = BadRequestError;
