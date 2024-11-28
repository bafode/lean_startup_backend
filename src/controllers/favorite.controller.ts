import { Request, Response } from "express";

import { favoriteService } from "../services";
import { IAppRequest } from "../types";
import { catchReq, pick } from "../utils";
import httpStatus from "http-status";

const toggleFavorite = catchReq(async (req: IAppRequest, res: Response) => {
    const postId = req.body.postId;
    const userId = req.user.toString();
    await favoriteService.toggleFavorite(postId, userId);
    res.status(httpStatus.OK).send({
        code: httpStatus.OK,
        message: "Favorite toggled",
    });
});

const getFavorites = catchReq(async (req: Request, res: Response) => {
    const filter = pick(req.query, ["user", "post"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await favoriteService.getFavorites(filter, options);
    res.send(result);
});

const getLoggedUserFavorites = catchReq(async (req: IAppRequest, res: Response) => {
    const filter = pick(req.query, ["user", "post"]);
    req.query.user = req.user.toString();
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const userId = req.user.toString();
    const result = await favoriteService.getLoggedUserFavorites(filter, options);
    res.send(result);
});



export default {
    toggleFavorite,
    getFavorites,
    getLoggedUserFavorites
};
