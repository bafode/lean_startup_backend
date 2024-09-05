import express from "express";

import { postController } from "../../controllers";
import { auth, upload, validate } from "../../middlewares";
import { EUserRole } from "../../types";
import { postValidation } from "../../validations";

const router = express.Router();

router.get(
  "/",
  auth(EUserRole.ADMIN, EUserRole.USER),
  validate(postValidation.getPosts),
  postController.getPosts
);
router.get(
  "/author",
  auth(EUserRole.ADMIN, EUserRole.USER),
  postController.getPostsByAuthorId
);
router.get(
  "/:postId",
  auth(EUserRole.ADMIN, EUserRole.USER),
  validate(postValidation.getPosts),
  postController.getOnePost
);
router.post(
  "/",
  auth(EUserRole.ADMIN, EUserRole.USER),
  upload.array("media", 10),
  validate(postValidation.createPost),
  postController.createPost
);

router.delete(
  "/:postId",
  auth(EUserRole.ADMIN, EUserRole.USER),
  postController.deletePost
);
router.patch(
  "/:postId",
  auth(EUserRole.ADMIN, EUserRole.USER),
  upload.array("media", 10),
  postController.updatePost
);

router.patch(
  "/:postId/likes",
  auth(EUserRole.ADMIN, EUserRole.USER),
  postController.toggleLikePost
);

router.post(
  "/:postId/comment",
  auth(EUserRole.ADMIN, EUserRole.USER),
  validate(postValidation.addComment),
  postController.addCommentToPost
);

export default router;
