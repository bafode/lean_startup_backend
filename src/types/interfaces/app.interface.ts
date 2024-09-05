import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ETokenType } from "..";
import { Request } from "express";

export interface IAppRequest extends Request {
  user?: mongoose.Schema.Types.ObjectId;
}

export interface ITokenPayload extends jwt.JwtPayload {
  type?: ETokenType;
}
