import mongoose, { Document, Schema } from "mongoose";

export interface IRating extends Document {
  userId: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  score: number;
  createdAt: Date;
}

const RatingSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Book", required: true },
  score: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IRating>("Rating", RatingSchema);
