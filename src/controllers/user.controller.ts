import { Request, Response } from "express";
import httpStatus from "http-status";
import { IAppRequest, IUser } from "../types";
import { authService, postService, userService } from "../services";
import { ApiError, catchReq, pick } from "../utils";

const createUser = catchReq(async (req: Request, res: Response) => {
  const data: IUser = req.body;
  data.password = "password1";
  const user = await authService.register(data);
  res.status(httpStatus.CREATED).send(user);
});
const getUsers = catchReq(async (req: Request, res: Response) => {
  const filter = pick(req.query, ["role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.getUsers(filter, options);
  res.send(result);
});

const getFavorites = catchReq(async (req: IAppRequest, res: Response) => {
  const filter = pick(req.query, ["role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await postService.getFavorites(req.user,filter, options);
  res.send(result);
});

const getLoggedUserPost = catchReq(async (req: IAppRequest, res: Response) => {
  const filter = pick(req.query, ["role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await postService.getLoggedUserPost(req.user, filter, options);
  res.send(result);
});

const getOneUser = catchReq(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchReq(async (req: Request, res: Response) => {
  let updatedUserData = { ...req.body };

  if (req.file) {
    updatedUserData.avatar = `uploads/images/${req.file.filename}`;
  }

  const user = await userService.updateUserById(
    req.params.userId,
    updatedUserData
  );
  res.send(user);
});

const deleteUser = catchReq(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const toggleUserFavorites = catchReq(async (req: IAppRequest, res: Response) => {
  const user = await userService.toggleUserFavorites(req.params.postId, req.user.toString());
  res.status(httpStatus.CREATED).send(user);
});

const toggleFollowUser = catchReq(async (req: IAppRequest, res: Response) => {
  const user = await userService.toggleFollowUser(req.user.toString(), req.params.followId);
  res.status(httpStatus.CREATED).send(user);
});
 
const getContacts = catchReq(async (req: IAppRequest, res: Response) => {
  const filter = pick(req.query, ['role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const loggedUser = req.user.toString();
  const result: any = await userService.getContacts(loggedUser, filter, options);

  res.status(httpStatus.OK).json({
    code: 0,
    data: result.results.map((contact: IUser | any) => ({
      avatar: contact.avatar ?? null,
      description: contact.description ?? null,
      online: contact.online ?? null,
      token: contact.id ?? null,
      firstname: contact.firstname ?? null,
      lastname: contact.lastname ?? null,
    })), // Return the array of users with fields set to `null` if missing
    msg: 'User list retrieved successfully',
  });
});


export default {
  createUser,
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
  toggleUserFavorites,
  getFavorites,
  toggleFollowUser,
  getLoggedUserPost,
  getContacts
};
