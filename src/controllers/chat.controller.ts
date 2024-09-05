import { Request, Response } from "express";
import { chatService } from "../services";
import { IAppRequest } from "../types";
import { catchReq, pick } from "../utils";

const getChats = catchReq(async (req: Request, res: Response) => {
    const filter = pick(req.query, ["user", "post"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await chatService.getChats(filter, options);
    res.send(result);
});

const accessChat = catchReq(async (req: IAppRequest, res: Response) => {
    const userId = req.body.userId;
    const loggedUserId = req.user.toString();
    const result = await chatService.accessChat(userId, loggedUserId);
    res.send(result);
});



export default {
    getChats,
    accessChat
};
