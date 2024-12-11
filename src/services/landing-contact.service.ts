import { ApiError } from "../utils";
import {  ILandingContact, IPaginateOption } from "../types";
import { LandingContact} from "../models";
import { FilterQuery } from "mongoose";
import httpStatus from "http-status";

const getLandingContacts = async (
    filter: FilterQuery<ILandingContact>,
    options: IPaginateOption
) => {
    options.sortBy = "createdAt:desc";
   
    const contacts = await LandingContact.paginate(filter, options);
    return contacts;
};



const getLandingContactById = async (id: string) => {
    return await LandingContact.findById(id);
};

export const createLandingContact = async (contact: ILandingContact) => {
    return (await LandingContact.create(contact));
};

const updateLandingContactById = async (
    contactId: string,
    updateBody: FilterQuery<ILandingContact>
) => {
    const contact = await getLandingContactById(contactId);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }

    Object.assign(contact, updateBody);
    await contact.save();
    return contact;
};

/**
 * Delete user by id
 * @param {ObjectId} postId
 * @returns {Promise<IPost>}
 */
const deleteLandingContactById = async (contactId: string) => {
    const contact = await getLandingContactById(contactId);
    if (!contact) {
        throw new ApiError(httpStatus.NOT_FOUND, "Contact not found");
    }
    await LandingContact.findByIdAndRemove(contactId);
    return contact;
};



export default {
    getLandingContacts,
    getLandingContactById,
    createLandingContact,
    updateLandingContactById,
    deleteLandingContactById,
};
