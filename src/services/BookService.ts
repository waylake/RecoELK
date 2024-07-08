import Book, { IBook } from "../models/Book";
import { esClient } from "../utils/elasticsearch";

export class BookService {
  public async getBookById(id: string): Promise<IBook | null> {
    return Book.findById(id);
  }

  public async createBook(bookData: Partial<IBook>): Promise<IBook> {
    const book = new Book(bookData);
    await book.save();

    await esClient.index({
      index: "books",
      body: {
        bookId: book._id,
        title: book.title,
        author: book.author,
        description: book.description,
        tags: book.tags,
      },
    });

    return book;
  }

  public async searchBooks(query: any): Promise<any> {
    const mustQueries = [];

    if (query.generalSearch) {
      mustQueries.push({
        multi_match: {
          query: query.generalSearch.join(" "),
          fields: ["title", "author", "description", "tags"],
        },
      });
    }

    ["title", "author", "tags"].forEach((field) => {
      if (query[field]) {
        mustQueries.push({
          match: {
            [field]: query[field].join(" "),
          },
        });
      }
    });

    const result = await esClient.search({
      index: "books",
      body: {
        query: {
          bool: {
            must: mustQueries,
          },
        },
      },
    });

    return result.hits.hits;
  }
}
