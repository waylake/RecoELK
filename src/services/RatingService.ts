import Rating, { IRating } from "../models/Rating";
import Book from "../models/Book";
import mongoose from "mongoose";
import { esClient } from "../utils/elasticsearch";

export class RatingService {
  public async addRating(
    userId: string,
    bookId: string,
    score: number,
  ): Promise<IRating> {
    const rating = new Rating({ userId, bookId, score });
    await rating.save();

    // Elasticsearch에 평점 데이터 인덱싱
    await esClient.index({
      index: "ratings",
      body: {
        userId,
        bookId,
        score,
        createdAt: new Date(),
      },
    });

    return rating;
  }

  public async getRecommendations(userId: string): Promise<any> {
    // 현재 사용자의 평점 데이터를 가져옴
    const userRatings = await Rating.find({ userId });

    if (userRatings.length === 0) {
      return [];
    }

    // 사용자가 높은 평점을 준 영화 목록을 가져옴
    const highRatedBooks = userRatings
      .map((r) => r.toObject()) // Document를 POJO로 변환
      .filter((r: IRating) => r.score >= 4)
      .map((r: IRating) => r.bookId.toString());

    // 다른 사용자들의 평점 데이터를 가져옴
    const otherRatings = await Rating.find({ userId: { $ne: userId } });

    // 간단한 유사도 계산: 공통 평점을 매긴 책의 수를 기반으로 유사도를 계산
    const recommendations: { [key: string]: number } = {};

    for (const rating of otherRatings) {
      const ratingObj = rating.toObject() as IRating;
      if (!highRatedBooks.includes(ratingObj.bookId.toString())) {
        if (!recommendations[ratingObj.bookId.toString()]) {
          recommendations[ratingObj.bookId.toString()] = 0;
        }
        recommendations[ratingObj.bookId.toString()] += ratingObj.score;
      }
    }

    // 추천 책을 평점 합계 기준으로 정렬하여 반환
    const recommendedBookIds = Object.keys(recommendations).sort(
      (a, b) => recommendations[b] - recommendations[a],
    );

    // 책 정보를 가져옴
    const recommendedBooks = await Book.find({
      _id: {
        $in: recommendedBookIds.map((id) => new mongoose.Types.ObjectId(id)),
      },
    });
    return recommendedBooks;
  }
}
