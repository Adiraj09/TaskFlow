import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export function createApp(): Express {
  const app = express();

  // Secure HTTP headers
  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      status: "ok",
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    });
  });

  // Route modules are mounted here as they are implemented in later stages.

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
