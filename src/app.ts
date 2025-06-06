import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import compression from "compression";
import path from "path";
import cookieParser from "cookie-parser";
import bodyParser from 'body-parser';
import { createServer } from "http";
import { routeV1 } from "./routes";
import { ApiError } from "./utils";
import httpStatus from "http-status";
import { errorConverter, errorHandler, MetricsMiddleware } from "./middlewares";
import metricsLoader from "./metrics.loader";

const app = express();


// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: false }));

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
app.use(bodyParser.json());
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const corsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200, // Code pour les requêtes OPTIONS réussies
};

app.use(cors(corsOptions));

// Helmet configuration (si nécessaire)
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "default-src": ["'self'"],
      "img-src": ["'self'", "data:"],
      "script-src": ["'self'", "'unsafe-inline'"],
    },
  },
}));

app.use(MetricsMiddleware);
metricsLoader(app);




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


export default app;