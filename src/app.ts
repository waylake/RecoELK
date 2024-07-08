import express from "express";
import mongoose from "mongoose";
import { createESIndices } from "./utils/elasticsearch";
import config from "./config";
import { logMiddleware } from "./middleware/logMiddleware";
import { authMiddleware } from "./middleware/authMiddleware";

import authRoutes from "./routes/auth";
import bookRoutes from "./routes/book";
import ratingRoutes from "./routes/rating";
import { swaggerUi, swaggerDocs } from "./swagger";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeElasticsearch();
    this.initializeSwagger();
  }

  private connectToDatabase(): void {
    mongoose.connect(config.MONGODB_URI, {}).then(
      () => {
        console.log("Connected to MongoDB");
      },
      (err) => {
        console.error("MongoDB connection error:", err);
      },
    );
  }

  private initializeSwagger(): void {
    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(logMiddleware);
  }

  private initializeRoutes(): void {
    this.app.use("/auth", authRoutes);
    this.app.use("/books", authMiddleware, bookRoutes);
    this.app.use("/ratings", authMiddleware, ratingRoutes);
  }

  private initializeElasticsearch(): void {
    createESIndices().catch(console.error);
  }

  public listen(): void {
    this.app
      .listen(config.PORT, () => {
        console.log(`App listening on the port ${config.PORT}`);
      })
      .on("error", (err) => {
        console.error("Server error:", err);
      });
  }
}

export default App;
