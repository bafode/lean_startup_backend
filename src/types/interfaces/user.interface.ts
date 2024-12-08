import mongoose from 'mongoose';
import { EAuthType, EGender, EUserRole } from '..';

export interface IUserID {
  id: string;
};
export interface IFirstname {
  firstname: string;
};
export interface ILastname {
  lastname: string;
};
export interface IEmail {
  email: string;
};
export interface IAvatar {
  avatar: string;
};
export interface IDescription {
  description: string;
};
export interface IGender {
  gender: EGender;
};
export interface IRole {
  role: EUserRole;
};
export interface IIsEmailVerified {
  isEmailVerified: boolean;
};
export interface IPassword {
  password: string;
}
export interface IStatus {
  accountClosed: boolean;
}

export interface ICity{
  city: string;
}
export interface ISchool { 
  school: string;
}
export interface IFieldOfStudy {
  fieldOfStudy: string;
}

export interface ILevelOfStudy {
  levelOfStudy: string;
}
export interface ICategories {
  categories: string[];
}
export interface IFavorites{
  favorites: mongoose.Types.ObjectId[];
}

export interface IFollowers {
  followers: mongoose.Types.ObjectId[];
}
export interface IFollowing {
  following: mongoose.Types.ObjectId[];
}

export interface IPhone { 
  phone: string;
}
export interface IOnline {
  online: boolean;
}
export interface IOpenID { 
  open_id: string;
}
export interface IAuthType{
  authType: EAuthType;
}

export interface IUser extends
  Partial<IFirstname>,
  Partial<ILastname>,
  Partial<IEmail>,
  Partial<IAvatar>,
  Partial<IDescription>,
  Partial<IFavorites>,
  Partial<IFollowers>,
  Partial<IFollowing>,
  Partial<IGender>,
  Partial<IRole>,
  Partial<IIsEmailVerified>,
  Partial<IStatus>,
  Partial<IPassword>,
  Partial<ICity>,
  Partial<ISchool>,
  Partial<IFieldOfStudy>,
  Partial<ILevelOfStudy>,
  Partial<ICategories>,
  Partial<IPhone>,
  Partial<IOnline>,
  Partial<IOpenID>,
  Partial<IAuthType>
{}

export interface IUserDocument extends mongoose.Document, IUser
{
  isPasswordMatch?: (password: string) => Promise<boolean>;
}