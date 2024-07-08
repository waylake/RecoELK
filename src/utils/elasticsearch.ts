import { Client } from "@elastic/elasticsearch";
import config from "../config";

export const esClient = new Client({ node: config.ES_NODE });

const checkElasticsearchConnection = async (retries = 5, delay = 3000) => {
  while (retries > 0) {
    try {
      await esClient.cluster.health({});
      console.log("Connected to Elasticsearch");
      return;
    } catch (error) {
      retries -= 1;
      console.log(
        `Elasticsearch connection failed. Retrying in ${delay / 1000} seconds...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Elasticsearch connection failed after multiple retries.");
};

export const createESIndices = async () => {
  try {
    await checkElasticsearchConnection();

    const booksIndexExists = await esClient.indices.exists({ index: "books" });
    if (booksIndexExists) {
      await esClient.indices.delete({ index: "books" });
      console.log("Deleted existing index: books");
    }
    await esClient.indices.create({
      index: "books",
      body: {
        mappings: {
          properties: {
            bookId: { type: "text" },
            title: { type: "text" },
            author: { type: "text" },
            description: { type: "text" },
            tags: { type: "text" },
            publishedDate: { type: "date" },
          },
        },
      },
    });
    console.log("Created index: books");

    const ratingsIndexExists = await esClient.indices.exists({
      index: "ratings",
    });
    if (ratingsIndexExists) {
      await esClient.indices.delete({ index: "ratings" });
      console.log("Deleted existing index: ratings");
    }
    await esClient.indices.create({
      index: "ratings",
      body: {
        mappings: {
          properties: {
            userId: { type: "text" },
            bookId: { type: "text" },
            score: { type: "integer" },
            createdAt: { type: "date" },
          },
        },
      },
    });

    console.log("Created index: ratings");
  } catch (error) {
    console.error(
      "Error creating Elasticsearch indices:",
      (error as any).message,
    );
  }
};
