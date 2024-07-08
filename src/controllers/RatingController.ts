import { Request, Response } from "express";
import { RatingService } from "../services/RatingService";

export class RatingController {
  private ratingService: RatingService;

  constructor() {
    this.ratingService = new RatingService();
  }

  public addRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const { bookId, score } = req.body;
      const rating = await this.ratingService.addRating(userId, bookId, score);
      res.status(201).json({ message: "Rating added successfully", rating });
    } catch (error) {
      res.status(500).json({ message: "Error adding rating", error });
    }
  };

  public getRecommendations = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = (req as any).userId;
      const recommendations =
        await this.ratingService.getRecommendations(userId);
      res.status(200).json(recommendations);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching recommendations", error });
    }
  };
}
