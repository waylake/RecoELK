import { Router } from "express";
import { BookController } from "../controllers/BookController";

const router = Router();
const bookController = new BookController();

/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: General search query (comma-separated)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Search by title (comma-separated)
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Search by author (comma-separated)
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Search by tags (comma-separated)
 *     responses:
 *       200:
 *         description: List of books
 *       400:
 *         description: Invalid query
 */
router.get("/search", bookController.searchBooks);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created
 *       400:
 *         description: Invalid input
 */
router.post("/", bookController.createBook);

export default router;
