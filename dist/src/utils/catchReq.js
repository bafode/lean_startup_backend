"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const catchReq = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
exports.default = catchReq;
//# sourceMappingURL=catchReq.js.map