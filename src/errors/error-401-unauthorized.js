"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UnauthorizedError extends Error {
    constructor(message = UnauthorizedError.DEFAULT_MESSAGE) {
        super(message);
        this.statusCode = UnauthorizedError.DEFAULT_STATUS_CODE;
    }
    static get DEFAULT_STATUS_CODE() {
        return 401;
    }
    static get DEFAULT_MESSAGE() {
        return 'Неверные почта или пароль';
    }
}
exports.default = UnauthorizedError;
