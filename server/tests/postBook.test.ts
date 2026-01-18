import app from "../index.js";
import request from "supertest";
import { afterEach, expect, test, vi } from "vitest";
import { book } from "./mockData.js";
import Book from "./../models/books.js";

const DEFAULT_USER_ID = "64a0c0b0c3f8fa2d1e4b0001";

// Unhappy path
// Force Book.findOne to reject once
test("Return 500 when DB fails", async () => {
  vi.spyOn(Book, "findOne").mockRejectedValueOnce(
    new Error("must be an error")
  );

  const res = await request(app).post("/books").send(book).expect(500);

  expect(res.body).toEqual({
    message: "Something went wrong when adding to the database - postBook",
  });

  // Reset the vi.spyOn
  afterEach(() => {
    vi.restoreAllMocks();
  });
});

// Happy path
// No matched ISBN in Book Document
test("Create a new book with ISBN", async () => {
  const res = await request(app)
    .post("/books")
    .send(book)
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  // Assert the response contains the created UserBook and the populated Book data
  expect(res.body).toEqual(
    expect.objectContaining({
      _id: expect.any(String),
      userId: DEFAULT_USER_ID,
      shelfIds: expect.arrayContaining([
        "64a0c0b0c3f8fa2d1e4c0011",
        "64a0c0b0c3f8fa2d1e4c0002",
      ]),
      format: book.userData.format,

      bookId: expect.objectContaining({
        _id: expect.any(String),
        title: book.title,
        authors: book.authors,
        isbn: book.isbn,
        cover: book.cover,
        worksKey: book.worksKey,
        editionKey: book.editionKey,
        pages: book.pages,
        publishedDate: new Date(book.publishedDate).toISOString(),
        description: book.description,
      }),
    })
  );
});

// ISBN is already in Book Document
test("Does not create a new Book when ISBN already exists", async () => {
  const before = await Book.countDocuments({ isbn: book.isbn });

  const res = await request(app)
    .post("/books")
    .send(book)
    .set("Content-Type", "application/json");

  const after = await Book.countDocuments({ isbn: book.isbn });

  expect(after).toBe(before);
});

// ISBN is not passed
test("Create a new book without ISBN", async () => {
  const { isbn, ...payload } = book;

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
