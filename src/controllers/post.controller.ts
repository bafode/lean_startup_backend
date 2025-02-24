import { NextFunction, Request, Response} from "express";

import { postService, userService } from "../services";
import { IPost, IAppRequest, IComment } from "../types";
import { ApiError, catchReq, pick } from "../utils";
import httpStatus from "http-status";
import { deleteMultipleCloudinaryFiles } from "../middlewares";

const createPost = catchReq(async (req: IAppRequest, res: Response) => {
  let data: IPost = { ...req.body };
  data.author = req.user;
  if (!req.files) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded");
  }
  const files: Express.Multer.File[] = req.files as Express.Multer.File[];
 
  // Map over the files and extract their Cloudinary URLs
  data.media = files.map((file: Express.Multer.File) => {
    return file.path; // The Cloudinary URL is in the `path` property of each file
  });
  const post = await postService.createPost(data);
  res.status(httpStatus.CREATED).send({
    code: httpStatus.CREATED,
    message: 'Post Created Succefully',
    post: post
  });
});

const getPosts = catchReq(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["query","category"]);
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
  res.status(httpStatus.OK).send(post);
});

const updatePost = catchReq(async (req: Request, res: Response) => {
  let updatedPostData: IPost = { ...req.body };

  if (req.files) {
    const files: Express.Multer.File[] = req.files as Express.Multer.File[];
    // Map over the files and extract their Cloudinary URLs
    updatedPostData.media = files.map((file: Express.Multer.File) => {
      return file.path; // Cloudinary URL is available in the `path` property
    });
  }

  const post = await postService.updatePostById(
    req.params.postId,
    updatedPostData
  );
  res.send(post);
});

const deletePost = catchReq(async (req: Request, res: Response,) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  // Ajouter les URLs des médias à la requête
  if (post.media && post.media.length > 0) {
   await deleteMultipleCloudinaryFiles(post.media);
  }

  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});


const addCommentToPost = catchReq(async (req: IAppRequest, res: Response) => {
  const data: IComment = req.body;
  const loggedInUser = await userService.getUserById(req.user.toString());
  data.userFirstName = loggedInUser.firstname;
  data.userLastName = loggedInUser.lastname;
  data.userAvatar = loggedInUser.avatar;
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
