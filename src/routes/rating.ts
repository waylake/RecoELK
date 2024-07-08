import { Router } from "express";
import { RatingController } from "../controllers/RatingController";

const router = Router();
const ratingController = new RatingController();

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Add a new rating
 *     tags: [Ratings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bookId:
 *                 type: string
 *               score:
 *                 type: number
 *     responses:
 *       201:
 *         description: Rating added successfully
 *       400:
 *         description: Invalid input
 */
router.post("/", ratingController.addRating);

/**
 * @swagger
 * /ratings/recommendations:
 *   get:
 *     summary: Get book recommendations for the user
 *     tags: [Ratings]
 *     responses:
 *       200:
 *         description: List of recommended books
 *       401:
 *         description: Unauthorized
 */
router.get("/recommendations", ratingController.getRecommendations);

export default router;
