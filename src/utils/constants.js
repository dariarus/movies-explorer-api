"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateURL = exports.validateId = exports.NAME_RU_REGEX = exports.NAME_EN_REGEX = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
// ^ - начало строки
// * - буквы, цифры и символы внутри [] повторяются 0 и более раз
exports.NAME_EN_REGEX = /^[A-Za-z0-9 -:]*$/;
exports.NAME_RU_REGEX = /^[А-Яа-я0-9 -:]*$/;
const validateId = (value) => {
    if (!mongoose_1.default.isObjectIdOrHexString(value)) {
        throw new Error('Неверный формат id');
    }
    return value;
};
exports.validateId = validateId;
const validateURL = (value) => {
    if (!validator_1.default.isURL(value)) {
        throw new Error('Неверный формат URL');
    }
    return value;
};
exports.validateURL = validateURL;
