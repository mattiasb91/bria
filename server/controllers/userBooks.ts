"use strict";

import UserBook from "./../models/userBooks.js";
import type { Request, Response } from "express";

const DEFAULT_USER_ID = "64a0c0b0c3f8fa2d1e4b0001";

export async function getUserBooks(req: Request, res: Response) {
  try {
    const userBooks = await UserBook.find({ userId: DEFAULT_USER_ID })
      .sort({ createdAt: 1 })
      .populate("bookId");
    console.log("userBooks in getuserbooks userbooks controller: ", userBooks);
    res.status(200).json(userBooks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message:
        "Something went wrong when retrieving from the database - getUserBooks",
    });
  }
}

export async function updateUserBookStatus(req: Request, res: Response) {
  const { bookId } = req.params;
  const status = req.body;
  console.log(bookId);
  console.log(status);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(bookId, status, {
      new: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
}

export async function updateUserBookOwned(req: Request, res: Response) {
  const { bookId } = req.params;
  const owned = req.body;
  console.log(bookId);
  console.log(owned);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(bookId, owned, {
      new: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
}

export async function updateUserBookFavorite(req: Request, res: Response) {
  const { bookId } = req.params;
  const favorite = req.body;
  console.log(bookId);
  console.log(favorite);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(bookId, favorite, {
      new: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
}

export async function updateUserBookProgress(req: Request, res: Response) {
  const { bookId } = req.params;
  const progress = req.body;
  console.log(bookId);
  console.log(progress);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(bookId, progress, {
      new: true,
    });
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
}

export async function updateUserBookFormat(req: Request, res: Response) {
  const { bookId } = req.params;
  const { format } = req.body;
  console.log(bookId);
  console.log("full req.bod format: ", req.body);
  console.log(format);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(
      bookId,
      { format },
      { new: true }
    );
    res.status(200).json(updatedBook);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json(error);
  }
}

export async function updateUserBookShelves(req: Request, res: Response) {
  const { bookId } = req.params;
  const { shelves } = req.body;
  console.log(bookId);
  console.log(shelves);
  try {
    const updatedBook = await UserBook.findByIdAndUpdate(
      bookId,
      { shelfIds: shelves },
      { new: true }
    );
    console.log("updated: ", updatedBook);
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500);
    res.json(error);
  }
}

// async function deleteUserBook (req, res) {
//   const {bookId } = req.params;
//   try {
//     const bookToDelete = await UserBook;
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//     res.json(error);
//   }
// }
