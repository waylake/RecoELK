import { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/redis";

export const cacheMiddleware = (duration: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.originalUrl;
    const cachedResponse = await redisClient.get(key);

    if (cachedResponse) {
      res.send(JSON.parse(cachedResponse));
      return;
    }

    const originalSend = res.send;
    res.send = function (body: any): Response {
      redisClient.setex(key, duration, JSON.stringify(body));
      return originalSend.call(this, body);
    };

    next();
  };
};
