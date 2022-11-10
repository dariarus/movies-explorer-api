"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const validator_1 = __importDefault(require("validator"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (v) => validator_1.default.isEmail(v),
            message: 'Неверный формат электронного адреса',
        },
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
});
exports.default = mongoose_1.default.model('user', userSchema);
