"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ForbiddenChangesError extends Error {
    constructor(message = ForbiddenChangesError.DEFAULT_MESSAGE) {
        super(message);
        this.statusCode = ForbiddenChangesError.DEFAULT_STATUS_CODE;
    }
    static get DEFAULT_STATUS_CODE() {
        return 403;
    }
    static get DEFAULT_MESSAGE() {
        return 'Нельзя удалять фильмы, сохраненные не Вами';
    }
}
exports.default = ForbiddenChangesError;
