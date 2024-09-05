import { Request, Response } from "express";

import { messageService } from "../services";
import { IAppRequest, IMessage } from "../types";
import { catchReq, pick } from "../utils";

const getMessages = catchReq(async (req: Request, res: Response) => {
    const filter = pick(req.query, ["chat", "post"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await messageService.getMessages(filter, options);
    res.send(result);
});

const sendMessage = catchReq(async (req: IAppRequest, res: Response) => {
    const data: IMessage = req.body;
    data.sender = req.user;
    const result = await messageService.sendMessage(data);
    res.send(result);
});



export default {
    getMessages,
    sendMessage
};
