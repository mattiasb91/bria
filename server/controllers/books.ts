"use strict";

import Book from "./../models/books.js";
import UserBook from "./../models/userBooks.js";
import type { Request, Response } from "express";

const DEFAULT_USER_ID = "64a0c0b0c3f8fa2d1e4b0001";

export async function postBook(req: Request, res: Response) {
  const {
    title,
    authors,
    cover,
    worksKey,
    editionKey,
    pages,
    publishedDate,
    description,
    userData,
  } = req.body;
  let { isbn } = req.body;

  isbn = typeof isbn === "string" && isbn.trim() ? isbn.trim() : undefined;

  try {
    let book;

    if (isbn) {
      book = await Book.findOne({ isbn: isbn });
      // no book is found for this isbn then add it
      if (!book) {
        book = await Book.create({
          title,
          authors,
          isbn,
          cover,
          worksKey,
          editionKey,
          pages,
          publishedDate,
          description,
        });
      }
    } else {
      book = await Book.create({
        title,
        authors,
        cover,
        worksKey,
        editionKey,
        pages,
        publishedDate,
        description,
      });
    }

    //add book for the user as well
    let userBook = await UserBook.findOne({
      userId: DEFAULT_USER_ID,
      bookId: book._id,
    });
    if (!userBook) {
      userBook = await UserBook.create({
        userId: DEFAULT_USER_ID,
        bookId: book._id,
        shelfIds: ["64a0c0b0c3f8fa2d1e4c0011", "64a0c0b0c3f8fa2d1e4c0002"],
        format: userData.format,
      });
    }

    //rebuild correctly by fetching the book
    let bookToSendBack = await UserBook.findOne({ _id: userBook._id }).populate(
      "bookId",
    );
    res.status(201).json(bookToSendBack);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong when adding to the database - postBook",
    });
  }
}
