import { Request, Response } from "express";
import mongoose from "mongoose";
export interface IComment {
  content: string;
  userFirstName: string;
  userLastName: string;
  userAvatar: string;
}

export interface IPost {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  likes?: mongoose.Schema.Types.ObjectId[];
  _id: string;
  media?: string[];
  comments?: IComment[];
  createdAt?: string;
  updatedAt?: string;
  category?: string;
}

export interface TPage {
  page: number;
  limit: number;
}

export interface TPaginationRequest extends Request {
  query: {
    limit: string;
    page: string;
    orderBy: string;
    sortBy: string;
    filterBy: string;
    category: string;
    search: string;
    content: string;
    title: string;
  };
}

export interface TPaginationResponse extends Response {
  paginatedResults?: {
    results: any;
    next: string;
    previous: string;
    currentPage: string;
    totalDocs: string;
    totalPages: string;
    lastPage: string;
  };
}
