import { Request, Response, NextFunction } from "express";

import { postService } from "../services";
import { IPost, IAppRequest, IComment } from "../types";
import { ApiError, catchReq, pick } from "../utils";
import httpStatus from "http-status";
import { ObjectId } from "mongoose";

const createPost = catchReq(async (req: IAppRequest, res: Response) => {
  let data: IPost = { ...req.body };
  data.author = req.user;
  if (!req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded");
  }
  const files: Express.Multer.File[] = req.files as Express.Multer.File[];
  data.media = files.map((file: Express.Multer.File) => {
    const isImage = file.mimetype.startsWith("image/");
    const pathPrefix = isImage ? "uploads/images" : "uploads/files";
    return `${pathPrefix}/${file.filename}`;
  });
  const post = await postService.createPost(data);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Post Created Succefully',
    post: post
  });
});

const getPosts = catchReq(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["title", "content", "category", "author"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await postService.getPosts(filter, options);
  res.send(result);
});

const getPostsByAuthorId = catchReq(async (req: IAppRequest, res: Response) => {
  const authorId: string = req.query.authorId ? req.query.authorId as string : req.user.toString();
  const result = await postService.getPostByAuthorId(authorId);
  res.send(result);
});

const getOnePost = catchReq(async (req: Request, res: Response) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  res.send(post);
});

const updatePost = catchReq(async (req: Request, res: Response) => {
  let updatedPostData: IPost = { ...req.body };

  if (req.files) {
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    updatedPostData.media = files.map(
      (file: Express.Multer.File) => `uploads/images/${file.filename}`
    );
  }

  const post = await postService.updatePostById(
    req.params.postId,
    updatedPostData
  );
  res.send(post);
});

const deletePost = catchReq(async (req: Request, res: Response) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});


const addCommentToPost = catchReq(async (req: Request, res: Response) => {
  const data: IComment = req.body;
  const post = await postService.addCommentToPost(req.params.postId, data);
  res.status(httpStatus.CREATED).send(post);
});

const toggleLikePost = catchReq(async (req: IAppRequest, res: Response) => {
  const post = await postService.toggleLikePost(req.params.postId, req.user);
  res.status(httpStatus.CREATED).send(post);
});

export default {
  createPost,
  getPosts,
  getOnePost,
  updatePost,
  deletePost,
  getPostsByAuthorId,
  addCommentToPost,
  toggleLikePost
};