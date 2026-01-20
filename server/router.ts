import express from "express";

import { postBook } from "./controllers/books.js";
import {
  getUserBooks,
  updateUserBookStatus,
  updateUserBookOwned,
  updateUserBookFavorite,
  updateUserBookProgress,
  updateUserBookFormat,
  updateUserBookShelves,
} from "./controllers/userBooks.js";

const router = express.Router();

router.post("/books", postBook); // add book to user
router.get("/userbooks", getUserBooks); // TO DO: Remember to change it on the frontend
router.put("/userbooks/:id/status", updateUserBookStatus); // update book status
router.put("/userbooks/:bookId/owned", updateUserBookOwned); // update book owned
router.put("/userbooks/:id/favorite", updateUserBookFavorite); // update book favorite
router.put("/userbooks/:id/progress", updateUserBookProgress); // update book progress
router.put("/userbooks/:id/format", updateUserBookFormat); // update book format
router.put("/userbooks/:id/shelves", updateUserBookShelves); // update book shelves
// TODO: add all endpoints here

export default router;
