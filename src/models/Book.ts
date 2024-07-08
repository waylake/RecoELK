import mongoose, { Document, Schema } from "mongoose";

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  tags: string[];
  publishedDate: Date;
}

const BookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: [String], required: true },
  publishedDate: { type: Date, default: Date.now },
});

export default mongoose.model<IBook>("Book", BookSchema);
