import { Request, Response } from "express";
import { BookService } from "../services/BookService";

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  public getBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.getBookById(req.params.id);
      if (book) {
        res.json(book);
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching book", error });
    }
  };

  public createBook = async (req: Request, res: Response): Promise<void> => {
    try {
      const book = await this.bookService.createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      res.status(500).json({ message: "Error creating book", error });
    }
  };

  public searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
      const query = this.parseSearchQuery(req.query);
      const results = await this.bookService.searchBooks(query);
      res.json(results);
    } catch (error) {
      res.status(400).json({ message: "Invalid search query", error });
    }
  };

  private parseSearchQuery(queryParams: any): object {
    const query: any = {};

    if (typeof queryParams.q === "string") {
      query.generalSearch = queryParams.q
        .split(",")
        .map((q: string) => q.trim());
    }

    const allowedFields = ["title", "author", "tags"];
    allowedFields.forEach((field) => {
      if (queryParams[field]) {
        query[field] = queryParams[field]
          .split(",")
          .map((q: string) => q.trim());
      }
    });

    return query;
  }
}
