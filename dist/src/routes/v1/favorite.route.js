"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../controllers");
const middlewares_1 = require("../../middlewares");
const types_1 = require("../../types");
const validations_1 = require("../../validations");
const router = express_1.default.Router();
router.get("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.favoriteValidation.getFavorites), controllers_1.favoriteController.getFavorites);
router.post("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.favoriteValidation.toggleFavorite), controllers_1.favoriteController.toggleFavorite);
router.get("/me", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), controllers_1.favoriteController.getLoggedUserFavorites);
exports.default = router;
//# sourceMappingURL=favorite.route.js.map