"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const celebrate_1 = require("celebrate");
const users_1 = require("../controllers/users");
const router = (0, express_1.Router)();
router.get('/me', users_1.getUser);
router.patch('/me', (0, celebrate_1.celebrate)({
    body: celebrate_1.Joi.object().keys({
        name: celebrate_1.Joi.string().min(2).max(30),
        email: celebrate_1.Joi.string().email(),
        password: celebrate_1.Joi.string().min(4),
    }),
}), users_1.updateUser);
exports.default = router;
