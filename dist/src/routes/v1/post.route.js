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
router.get("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.postValidation.getPosts), controllers_1.postController.getPosts);
router.get("/author", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), controllers_1.postController.getPostsByAuthorId);
router.get("/:postId", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.postValidation.getPosts), controllers_1.postController.getOnePost);
router.post("/", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), middlewares_1.upload.array("media", 10), (0, middlewares_1.validate)(validations_1.postValidation.createPost), controllers_1.postController.createPost);
router.delete("/:postId", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), controllers_1.postController.deletePost);
router.patch("/:postId", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), middlewares_1.upload.array("media", 10), controllers_1.postController.updatePost);
router.patch("/:postId/likes", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), controllers_1.postController.toggleLikePost);
router.post("/:postId/comment", (0, middlewares_1.auth)(types_1.EUserRole.ADMIN, types_1.EUserRole.USER), (0, middlewares_1.validate)(validations_1.postValidation.addComment), controllers_1.postController.addCommentToPost);
exports.default = router;
//# sourceMappingURL=post.route.js.map