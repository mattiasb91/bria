import app from "../index.js";
import request from "supertest";
import { expect, test } from "vitest";
import { bookWithIsbn, bookWithoutIsbn } from "./mockData.js";
import Book from "./../models/books.js";

const DEFAULT_USER_ID = "64a0c0b0c3f8fa2d1e4b0001";

// Happy path
// No matched ISBN in Book Document
test("Create a new book with ISBN", async () => {
  const payload = bookWithIsbn;

  const res = await request(app)
    .post("/books")
    .send(payload)
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  // Check wether the book in Response matches with payload
  expect(res.body).toEqual(
    expect.objectContaining({
      _id: expect.any(String),
      userId: DEFAULT_USER_ID,
      shelfIds: expect.arrayContaining([
        "64a0c0b0c3f8fa2d1e4c0011",
        "64a0c0b0c3f8fa2d1e4c0002",
      ]),
      format: payload.userData.format,

      bookId: expect.objectContaining({
        _id: expect.any(String),
        title: payload.title,
        authors: payload.authors,
        isbn: payload.isbn,
        cover: payload.cover,
        worksKey: payload.worksKey,
        editionKey: payload.editionKey,
        pages: payload.pages,
        publishedDate: new Date(payload.publishedDate).toISOString(),
        description: payload.description,
      }),
    })
  );
});

// ISBN is already in Book Document
test("Do nothing when ISBN already exists", async () => {
  const payload = bookWithIsbn;

  const before = await Book.countDocuments({ isbn: payload.isbn });

  const res = await request(app)
    .post("/books")
    .send(payload)
    .set("Content-Type", "application/json");

  const after = await Book.countDocuments({ isbn: payload.isbn });

  expect(after).toBe(before);
});

// ISBN is not passed
test("Create a new book without ISBN", async () => {
  const payload = bookWithoutIsbn;

  const res = await request(app)
    .post("/books")
    .send(payload)
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  // Check wether the book in Response matches with payload
  expect(res.body).toEqual(
    expect.objectContaining({
      _id: expect.any(String),
      userId: DEFAULT_USER_ID,
      shelfIds: expect.arrayContaining([
        "64a0c0b0c3f8fa2d1e4c0011",
        "64a0c0b0c3f8fa2d1e4c0002",
      ]),
      format: payload.userData.format,

      bookId: expect.objectContaining({
        _id: expect.any(String),
        title: payload.title,
        authors: payload.authors,
        cover: payload.cover,
        worksKey: payload.worksKey,
        editionKey: payload.editionKey,
        pages: payload.pages,
        publishedDate: new Date(payload.publishedDate).toISOString(),
        description: payload.description,
      }),
    })
  );
});
