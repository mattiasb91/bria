'use strict';

import { Schema, model,Document, type InferSchemaType, Types } from "mongoose";

const bookSchema = new Schema({
  worksKey: {
    type: String,
    required: false,
  },
  editionKey: {
    type: String,
    required: false,
  },
  isbn: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  pages: {
    type: Number,
    required: false,
  },
  cover: {
    type: Number,
    required: false,
  },
  publishedDate: {
    type: Date,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  genres: {
    type: [String],
    required: false,
  },
  rating: {
    type: Number,
    required: false,
  }
}, {
  timestamps: true,
});

export type BookType = InferSchemaType<typeof bookSchema>

export interface IBook extends BookType, Document {

}

const Book = model<IBook>('Book',bookSchema) 

export default Book;