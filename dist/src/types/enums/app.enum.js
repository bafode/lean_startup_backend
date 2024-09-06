"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETokenType = exports.EGender = exports.EUserRole = exports.EModelNames = exports.ENodeEnv = void 0;
var ENodeEnv;
(function (ENodeEnv) {
    ENodeEnv["DEV"] = "development";
    ENodeEnv["PROD"] = "production";
    ENodeEnv["TEST"] = "test";
})(ENodeEnv = exports.ENodeEnv || (exports.ENodeEnv = {}));
var EModelNames;
(function (EModelNames) {
    EModelNames["USER"] = "User";
    EModelNames["TOKEN"] = "Token";
    EModelNames["POST"] = "Post";
    EModelNames["FAVORITE"] = "Favorite";
    EModelNames["MESSAGE"] = "Message";
    EModelNames["CHAT"] = "Chat";
})(EModelNames = exports.EModelNames || (exports.EModelNames = {}));
var EUserRole;
(function (EUserRole) {
    EUserRole["USER"] = "user";
    EUserRole["ADMIN"] = "admin";
})(EUserRole = exports.EUserRole || (exports.EUserRole = {}));
var EGender;
(function (EGender) {
    EGender["MALE"] = "male";
    EGender["FEMALE"] = "female";
})(EGender = exports.EGender || (exports.EGender = {}));
var ETokenType;
(function (ETokenType) {
    ETokenType["ACCESS"] = "access";
    ETokenType["REFRESH"] = "refresh";
    ETokenType["RESET_PASSWORD"] = "resetPassword";
    ETokenType["VERIFY_EMAIL"] = "verifyEmail";
})(ETokenType = exports.ETokenType || (exports.ETokenType = {}));
//# sourceMappingURL=app.enum.js.map