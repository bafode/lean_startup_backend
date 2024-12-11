import { Request, Response } from "express";

import { emailService, landingContactService } from "../services";
import { IAppRequest, ILandingContact } from "../types";
import { catchReq, pick } from "../utils";
import httpStatus from "http-status";

const createLandingContact = catchReq(async (req: IAppRequest, res: Response) => {
    console.log(req.body);
    let data: ILandingContact = { ...req.body };
    const contact = await landingContactService.createLandingContact(data);
    emailService.sendWelcomeEmail(contact.email);
    res.status(httpStatus.CREATED).send({
        code: httpStatus.CREATED,
        message: 'Contact Created Succefully',
        post: contact
    });
});

const getLandingContacts = catchReq(async (req: Request, res: Response) => {
    const filter = pick(req.query, ["email"]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);
    const result = await landingContactService.getLandingContacts(filter, options);
    res.send(result);
});

const getLandingContactById = catchReq(async (req: IAppRequest, res: Response) => {
    const result = await landingContactService.getLandingContactById(req.params.contactId);
    res.send(result);
});


const updateLandingContactById = catchReq(async (req: Request, res: Response) => {
    let updatedData: ILandingContact = { ...req.body };

    const contact = await landingContactService.updateLandingContactById(
        req.params.contactId,
        updatedData
    );
    res.send(contact);
});

const deleteLandingContactById = catchReq(async (req: Request, res: Response) => {
    await landingContactService.deleteLandingContactById(req.params.contactId);
    res.status(httpStatus.NO_CONTENT).send();
});




export default {
    createLandingContact,
    getLandingContacts,
    getLandingContactById,
    updateLandingContactById,
    deleteLandingContactById
};
