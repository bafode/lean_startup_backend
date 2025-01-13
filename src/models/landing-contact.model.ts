import mongoose, { FilterQuery, Model, Schema } from "mongoose";
import { EModelNames, IPaginateOption,ILandingContact } from "../types";
import { paginate, toJSON } from "./plugins";

interface ILandingContactModel extends Model<ILandingContact> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paginate?: (
        filter: FilterQuery<ILandingContact>,
        options: IPaginateOption
    ) => Promise<[ILandingContact, any]>;
}

const landingContactSchema: Schema<ILandingContact> = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            required: [true, "Please provide email"],
        },
        subject: {
            type: String,
            trim: true,
        },
        message: {
            type: String,
            trim: true,
        },
        terms: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);



// Plugin that converts mongoose to json
landingContactSchema.plugin(toJSON);
landingContactSchema.plugin(paginate);


const LandingContact = mongoose.model<ILandingContact, ILandingContactModel>(EModelNames.LANDING_CONTACT, landingContactSchema);

export default LandingContact;
