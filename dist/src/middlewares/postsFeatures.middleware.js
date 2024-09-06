"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsPaginationMiddleware = void 0;
const models_1 = require("../models");
const postsPaginationMiddleware = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 2;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {
            currentPage: {
                page,
                limit,
            },
            totalDocs: 0,
        };
        const totalCount = yield models_1.Post.countDocuments().exec();
        results.totalDocs = totalCount;
        if (endIndex < totalCount) {
            results.next = {
                page: page + 1,
                limit,
            };
        }
        if (startIndex > 0) {
            results.previous = {
                page: page - 1,
                limit,
            };
        }
        results.totalPages = Math.ceil(totalCount / limit);
        results.lastPage = Math.ceil(totalCount / limit);
        // Sort
        const sort = {};
        // Sort
        if (req.query.sortBy && req.query.orderBy) {
            sort[req.query.sortBy] =
                req.query.orderBy.toLowerCase() === "desc" ? -1 : 1;
        }
        else {
            sort.createdAt = -1;
        }
        // Filter
        let filter = {};
        if (req.query.filterBy && req.query.category) {
            console.log(req.query.category.toLowerCase());
            if (req.query.category.toLowerCase() === "sports") {
                filter.$or = [{ category: "sports" }];
            }
            else if (req.query.category.toLowerCase() === "coding") {
                filter.$or = [{ category: "coding" }];
            }
            else if (req.query.category.toLowerCase() === "typescript") {
                filter.$or = [{ category: "typescript" }];
            }
            else if (req.query.category.toLowerCase() === "nodejs") {
                filter.$or = [{ category: "nodejs" }];
            }
            else if (req.query.category.toLowerCase() === "all") {
                filter = {};
            }
            else {
                filter = {};
            }
        }
        // Search
        if (req.query.search) {
            filter = {
                $or: [
                    { title: { $regex: req.query.search } },
                    { content: { $regex: req.query.search } },
                    { category: { $regex: req.query.search } },
                ],
            };
        }
        try {
            results.results = yield models_1.Post.find(filter)
                .select("title content postImage author createdAt updatedAt, category")
                .populate("author", "name firstName lastName  surname email dateOfBirth gender joinedDate isVerified  profileImage  mobileNumber  status role  companyName   acceptTerms nationality  favoriteAnimal  address  bio")
                .limit(limit)
                .sort(sort)
                .skip(startIndex)
                .exec();
            // Add paginated Results to the request
            res.paginatedResults = results;
            next();
        }
        catch (error) {
            return next(error);
        }
    });
};
exports.postsPaginationMiddleware = postsPaginationMiddleware;
exports.default = exports.postsPaginationMiddleware;
//# sourceMappingURL=postsFeatures.middleware.js.map