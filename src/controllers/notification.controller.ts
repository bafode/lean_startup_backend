import { Request, Response } from 'express';
import { notificationService, userService } from '../services';
import { ApiError, catchReq } from '../utils';
import { IAppRequest } from 'index';
import { log } from 'winston';
import httpStatus from 'http-status';


const send_notice = catchReq(async (req: IAppRequest, res: Response) => {
    const loggedUser = await userService.getUserById(req.user.toString());
    const { to_firstname, to_lastname, to_avatar, to_token, call_type, doc_id } = req.body;
    
    const response = await notificationService.sendNotification({
        userToken: loggedUser.id,
        userAvatar: loggedUser.avatar,
        userFirstName: loggedUser.firstname,
        userLastName: loggedUser.lastname,
        toToken: to_token,
        toFirstname: to_firstname,
        toLastname: to_lastname,
        toAvatar: to_avatar,
        callType: call_type,
        docId: doc_id
    });
    return res.status(response.code === 0 ? 200 : 400).json(response);
});

const uploadMedia = catchReq(async (req: IAppRequest, res: Response) => {

    if (!req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, "No files uploaded");
    }
    const file: Express.Multer.File = req.file as Express.Multer.File;
    const isImage = file.mimetype.startsWith("image/");
    const pathPrefix = isImage ? "uploads/images" : "uploads/files";
    const filePath = `${pathPrefix}/${file.filename}`;
    return res.status(httpStatus.OK).send({
        code: 0,
        msg: 'File Uploaded Succefully',
        data: filePath
    });
});

export default {
    send_notice,
    uploadMedia
};
