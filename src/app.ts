import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import path from "path";
import { createServer } from "http";
import { config } from "./config";
import { ENodeEnv } from "./types";
import { routeV1 } from "./routes";
import { ApiError } from "./utils";
import httpStatus from "http-status";
import { errorConverter, errorHandler } from "./middlewares";
import setupSocket from "./socket";

const app = express();

// set security HTTP headers
if (config.env === ENodeEnv.PROD) {
  app.use(helmet());
}

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable request logging for development and production debugging
  app.use(morgan("dev"));


// enable cors
app.use(cors());
app.options("*", cors());

// routes
app.use("/v1", routeV1);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert any error to an ApiError
app.use(errorConverter);

// handle error
app.use(errorHandler);

// Create HTTP server and integrate socket.io
const server = createServer(app);
setupSocket(server);


export default app;
