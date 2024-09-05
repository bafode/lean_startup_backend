import express from "express";
import { config } from "../../config";
import { ENodeEnv } from "../../types";
import authRoute from "./auth.route";
import userRoute from "./user.route";
import docRoute from "./doc.route";
import postRoute from "./post.route";
import favoriteRoute from "./favorite.route";
import chatRoute from "./chat.route";
import messageRoute from "./message.route";

const routes = express.Router();

routes.use("/auth", authRoute);
routes.use("/users", userRoute);
routes.use("/posts", postRoute);
routes.use("/favorites", favoriteRoute);
routes.use("/chats", chatRoute);
routes.use("/messages", messageRoute);


if (config.env === ENodeEnv.DEV) {
  routes.use("/docs", docRoute);
}

export default routes;
