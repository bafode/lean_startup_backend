import mongoose from "mongoose";
import app from "./app";
import { config, logger } from "./config";

mongoose.set("strictQuery", true);
mongoose
  .connect(config.mongoose.devUrl, config.mongoose.options)
  .then(async () => {
    app.listen(config.port, () => {
      logger.info(`🚀 Server listening to port ${config.port}`);
    });
  });
