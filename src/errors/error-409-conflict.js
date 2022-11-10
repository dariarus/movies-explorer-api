"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UniqueFieldConflict extends Error {
    constructor(message = UniqueFieldConflict.DEFAULT_MESSAGE) {
        super(message);
        this.statusCode = UniqueFieldConflict.DEFAULT_STATUS_CODE;
    }
    static get DEFAULT_STATUS_CODE() {
        return 409;
    }
    static get DEFAULT_MESSAGE() {
        return 'Указанная почта уже зарегистрирована';
    }
}
exports.default = UniqueFieldConflict;
