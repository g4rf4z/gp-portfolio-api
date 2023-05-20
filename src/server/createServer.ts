import express from "express";
import config from "config";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";

import deserializeToken from "../middlewares/deserializeToken.middleware";

import routes from "../routes";

// Initialize an ExpressJS instance.
const createServer = () => {
  // Create an ExpressJS instance.
  const app = express();
  const clientUrl = config.get<string>("clientUrl").split(",");
  app.use(helmet({ expectCt: false }));
  app.use(
    cors({
      credentials: true,
      origin: clientUrl,
      methods: ["GET", "POST", "PATCH", "DELETE"],
    })
  );
  app.use(express.json({ limit: "5MB" }));
  app.use(cookieParser());
  app.use(deserializeToken);
  routes(app);
  return app;
};

export default createServer;
