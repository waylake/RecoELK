import { Request, Response, NextFunction } from "express";
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.File({ filename: "logs/app.log" })],
});

export const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.info(`${req.method} ${req.url}`, {
    ip: req.ip,
    headers: req.headers,
    query: req.query,
    body: req.body,
  });
  next();
};
