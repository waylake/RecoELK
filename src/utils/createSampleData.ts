import mongoose from "mongoose";
import axios from "axios";
import config from "../config";
import User from "../models/User";
import Book from "../models/Book";
import Rating from "../models/Rating";

// MongoDB 연결
mongoose
  .connect(config.MONGODB_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
    createSampleData();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const createSampleData = async () => {
  try {
    // 기존 데이터 삭제
    await User.deleteMany({});
    await Book.deleteMany({});
    await Rating.deleteMany({});

    // Elasticsearch 인덱스 생성

    // 사용자 데이터
    const usersData = [
      { name: "Alice", email: "alice@example.com", password: "password123" },
      { name: "Bob", email: "bob@example.com", password: "password123" },
      {
        name: "Charlie",
        email: "charlie@example.com",
        password: "password123",
      },
      { name: "David", email: "david@example.com", password: "password123" },
      { name: "Eve", email: "eve@example.com", password: "password123" },
      { name: "Frank", email: "frank@example.com", password: "password123" },
      { name: "Grace", email: "grace@example.com", password: "password123" },
      { name: "Hank", email: "hank@example.com", password: "password123" },
      { name: "Ivy", email: "ivy@example.com", password: "password123" },
      { name: "Jack", email: "jack@example.com", password: "password123" },
    ];

    // 사용자 생성 및 로그인
    const userIds = [];
    const tokens = [];
    for (const userData of usersData) {
      await axios.post("http://localhost:3000/auth/register", userData);
      const response = await axios.post("http://localhost:3000/auth/login", {
        email: userData.email,
        password: userData.password,
      });
      userIds.push(response.data.userId);
      tokens.push(response.data.token);
    }

    // 책 데이터 (태그 포함)
    const booksData = [
      // 액션 영화
      {
        title: "Spider-Man",
        author: "Author A",
        description: "Spider-Man Description",
        tags: ["action", "superhero", "marvel", "adventure", "comics"],
        publishedDate: new Date(),
      },
      {
        title: "Avengers",
        author: "Author B",
        description: "Avengers Description",
        tags: ["action", "superhero", "marvel", "team", "blockbuster"],
        publishedDate: new Date(),
      },
      {
        title: "Iron Man",
        author: "Author C",
        description: "Iron Man Description",
        tags: ["action", "superhero", "marvel", "technology", "comics"],
        publishedDate: new Date(),
      },
      {
        title: "Thor",
        author: "Author D",
        description: "Thor Description",
        tags: ["action", "superhero", "marvel", "mythology", "adventure"],
        publishedDate: new Date(),
      },
      {
        title: "Hulk",
        author: "Author E",
        description: "Hulk Description",
        tags: ["action", "superhero", "marvel", "strength", "adventure"],
        publishedDate: new Date(),
      },
      {
        title: "Captain America",
        author: "Author F",
        description: "Captain America Description",
        tags: ["action", "superhero", "marvel", "patriotism", "comics"],
        publishedDate: new Date(),
      },
      {
        title: "Black Panther",
        author: "Author G",
        description: "Black Panther Description",
        tags: ["action", "superhero", "marvel", "africa", "technology"],
        publishedDate: new Date(),
      },

      // 로맨스 영화
      {
        title: "The Notebook",
        author: "Author H",
        description: "The Notebook Description",
        tags: ["romance", "drama", "love", "nostalgia", "relationships"],
        publishedDate: new Date(),
      },
      {
        title: "Pride and Prejudice",
        author: "Author I",
        description: "Pride and Prejudice Description",
        tags: ["romance", "classic", "drama", "british", "literature"],
        publishedDate: new Date(),
      },
      {
        title: "La La Land",
        author: "Author J",
        description: "La La Land Description",
        tags: ["romance", "musical", "drama", "hollywood", "dreams"],
        publishedDate: new Date(),
      },
      {
        title: "A Walk to Remember",
        author: "Author K",
        description: "A Walk to Remember Description",
        tags: ["romance", "drama", "love", "faith", "teen"],
        publishedDate: new Date(),
      },
      {
        title: "Titanic",
        author: "Author L",
        description: "Titanic Description",
        tags: ["romance", "drama", "disaster", "historical", "love"],
        publishedDate: new Date(),
      },

      // SF 영화
      {
        title: "Inception",
        author: "Author M",
        description: "Inception Description",
        tags: ["sf", "action", "mind-bending", "dreams", "thriller"],
        publishedDate: new Date(),
      },
      {
        title: "Interstellar",
        author: "Author N",
        description: "Interstellar Description",
        tags: ["sf", "space", "drama", "future", "exploration"],
        publishedDate: new Date(),
      },
      {
        title: "The Matrix",
        author: "Author O",
        description: "The Matrix Description",
        tags: ["sf", "action", "cyberpunk", "ai", "thriller"],
        publishedDate: new Date(),
      },
      {
        title: "Blade Runner",
        author: "Author P",
        description: "Blade Runner Description",
        tags: ["sf", "cyberpunk", "action", "future", "dystopia"],
        publishedDate: new Date(),
      },
      {
        title: "Star Wars",
        author: "Author Q",
        description: "Star Wars Description",
        tags: ["sf", "space", "adventure", "fantasy", "action"],
        publishedDate: new Date(),
      },
    ];

    // 책 생성
    const bookIds = [];
    for (const bookData of booksData) {
      const response = await axios.post(
        "http://localhost:3000/books",
        bookData,
        {
          headers: {
            Authorization: `Bearer ${tokens[0]}`, // 첫 번째 사용자의 토큰을 사용하여 책을 생성
          },
        },
      );
      bookIds.push(response.data._id);
    }

    // 평점 데이터
    const ratingsData = [
      // Alice's ratings
      { userId: userIds[0], bookId: bookIds[0], score: 5 }, // Alice -> Spider-Man
      { userId: userIds[0], bookId: bookIds[1], score: 4 }, // Alice -> Avengers
      { userId: userIds[0], bookId: bookIds[7], score: 5 }, // Alice -> The Notebook
      { userId: userIds[0], bookId: bookIds[13], score: 4 }, // Alice -> Interstellar

      // Bob's ratings
      { userId: userIds[1], bookId: bookIds[2], score: 5 }, // Bob -> Iron Man
      { userId: userIds[1], bookId: bookIds[3], score: 3 }, // Bob -> Thor
      { userId: userIds[1], bookId: bookIds[8], score: 4 }, // Bob -> Pride and Prejudice
      { userId: userIds[1], bookId: bookIds[14], score: 5 }, // Bob -> The Matrix

      // Charlie's ratings
      { userId: userIds[2], bookId: bookIds[4], score: 2 }, // Charlie -> Hulk
      { userId: userIds[2], bookId: bookIds[5], score: 4 }, // Charlie -> Captain America
      { userId: userIds[2], bookId: bookIds[9], score: 5 }, // Charlie -> La La Land
      { userId: userIds[2], bookId: bookIds[15], score: 3 }, // Charlie -> Blade Runner

      // David's ratings
      { userId: userIds[3], bookId: bookIds[1], score: 4 }, // David -> Avengers
      { userId: userIds[3], bookId: bookIds[6], score: 5 }, // David -> Black Panther
      { userId: userIds[3], bookId: bookIds[10], score: 2 }, // David -> A Walk to Remember
      { userId: userIds[3], bookId: bookIds[16], score: 4 }, // David -> Star Wars

      // Eve's ratings
      { userId: userIds[4], bookId: bookIds[0], score: 5 }, // Eve -> Spider-Man
      { userId: userIds[4], bookId: bookIds[11], score: 4 }, // Eve -> Titanic
      { userId: userIds[4], bookId: bookIds[12], score: 3 }, // Eve -> Inception
      { userId: userIds[4], bookId: bookIds[13], score: 5 }, // Eve -> Interstellar

      // Additional users' ratings
      { userId: userIds[5], bookId: bookIds[1], score: 5 }, // Frank -> Avengers
      { userId: userIds[5], bookId: bookIds[14], score: 4 }, // Frank -> The Matrix
      { userId: userIds[6], bookId: bookIds[0], score: 3 }, // Grace -> Spider-Man
      { userId: userIds[6], bookId: bookIds[15], score: 5 }, // Grace -> Blade Runner
      { userId: userIds[7], bookId: bookIds[2], score: 4 }, // Hank -> Iron Man
      { userId: userIds[7], bookId: bookIds[8], score: 5 }, // Hank -> Pride and Prejudice
      { userId: userIds[8], bookId: bookIds[3], score: 3 }, // Ivy -> Thor
      { userId: userIds[8], bookId: bookIds[10], score: 4 }, // Ivy -> A Walk to Remember
      { userId: userIds[9], bookId: bookIds[5], score: 5 }, // Jack -> Captain America
      { userId: userIds[9], bookId: bookIds[16], score: 4 }, // Jack -> Star Wars
    ];

    for (const ratingData of ratingsData) {
      await axios.post("http://localhost:3000/ratings", ratingData, {
        headers: {
          Authorization: `Bearer ${tokens[0]}`, // 첫 번째 사용자의 토큰을 사용하여 평점 추가
        },
      });
    }

    console.log("Sample data created successfully");
    process.exit(0);
  } catch (error) {
    console.error(
      "Error creating sample data:",
      (error as any).response
        ? (error as any).response.data
        : (error as any).message,
    );
    process.exit(1);
  }
};
