import app from "../app.js";
import request from "supertest";
import { expect, test, vi, beforeEach } from "vitest";
import { book } from "./mockData.js";
import Book from "./../models/books.js";
import UserBook from "./../models/userBooks.js";

const DEFAULT_USER_ID = "64a0c0b0c3f8fa2d1e4b0001";

beforeEach(() => {
  vi.restoreAllMocks();
});

// Unhappy path
test("Return 500 when DB fails", async () => {
  vi.spyOn(Book, "findOne").mockRejectedValueOnce(
    new Error("must be an error"),
  );

  const res = await request(app).post("/books").send(book);

  expect(res.status).toBe(500);
  expect(res.body).toEqual({
    message: "Something went wrong when adding to the database - postBook",
  });
});

// Happy path
// ISBN provided, and the Book does not exist
test("Create a new book with ISBN", async () => {
  const createdBook = {
    _id: "book-test-id-1",
    title: book.title,
    authors: book.authors,
    isbn: book.isbn,
    cover: book.cover,
    worksKey: book.worksKey,
    editionKey: book.editionKey,
    pages: book.pages,
    publishedDate: new Date(book.publishedDate).toISOString(),
    description: book.description,
  };

  const createdUserBook = {
    _id: "userbook-test-id-1",
    userId: DEFAULT_USER_ID,
    bookId: createdBook._id,
    shelfIds: ["64a0c0b0c3f8fa2d1e4c0011", "64a0c0b0c3f8fa2d1e4c0002"],
    format: book.userData.format,
  };

  const populatedToSendBack = {
    ...createdUserBook,
    bookId: createdBook, // after populate, bookId becomes a Book object
  };

  // search by ISBN -> not found
  vi.spyOn(Book, "findOne").mockResolvedValueOnce(null as any);
  // create Book
  vi.spyOn(Book, "create").mockResolvedValueOnce(createdBook as any);

  // check if UserBook exists -> not found
  vi.spyOn(UserBook, "findOne").mockResolvedValueOnce(null as any);
  // create UserBook
  vi.spyOn(UserBook, "create").mockResolvedValueOnce(createdUserBook as any);

  // We use mockReturnValueOnce here because we need to mock the populate() call.
  // The mocked `.populate()` returns the populated UserBook.
  vi.spyOn(UserBook, "findOne").mockReturnValueOnce({
    populate: vi.fn().mockResolvedValueOnce(populatedToSendBack),
  } as any);

  const res = await request(app)
    .post("/books")
    .send(book)
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  expect(res.body).toEqual(
    expect.objectContaining({
      _id: expect.any(String),
      userId: DEFAULT_USER_ID,
      shelfIds: expect.any(Array),
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
    }),
  );
});

// ISBN provided, and the Book already exists (so it should not be created)
test("Does not create a new Book when ISBN already exists", async () => {
  const existingBook = {
    _id: "book-object-id-existing",
    title: book.title,
    authors: book.authors,
    isbn: book.isbn,
    cover: book.cover,
    worksKey: book.worksKey,
    editionKey: book.editionKey,
    pages: book.pages,
    publishedDate: new Date(book.publishedDate).toISOString(),
    description: book.description,
  };

  const existingUserBook = {
    _id: "userbook-object-id-existing",
    userId: DEFAULT_USER_ID,
    bookId: existingBook._id,
    shelfIds: ["64a0c0b0c3f8fa2d1e4c0011", "64a0c0b0c3f8fa2d1e4c0002"],
    format: book.userData.format,
  };

  const populatedToSendBack = { ...existingUserBook, bookId: existingBook };

  vi.spyOn(Book, "findOne").mockResolvedValueOnce(existingBook as any);

  // check if UserBook exists -> found
  vi.spyOn(UserBook, "findOne").mockResolvedValueOnce(existingUserBook as any);

  vi.spyOn(UserBook, "findOne").mockReturnValueOnce({
    populate: vi.fn().mockResolvedValueOnce(populatedToSendBack),
  } as any);

  // verify Book.create was not called
  const createSpy = vi.spyOn(Book, "create");

  await request(app)
    .post("/books")
    .send(book)
    .set("Content-Type", "application/json")
    .expect(201);

  expect(createSpy).not.toHaveBeenCalled();
});

// No ISBN provided
test("Create a new book without ISBN", async () => {
  const { isbn, ...payload } = book;

  const createdBook = {
    _id: "book-object-id-noisbn",
    title: payload.title,
    authors: payload.authors,
    cover: payload.cover,
    worksKey: payload.worksKey,
    editionKey: payload.editionKey,
    pages: payload.pages,
    publishedDate: new Date(payload.publishedDate).toISOString(),
    description: payload.description,
  };

  const createdUserBook = {
    _id: "userbook-object-id-noisbn",
    userId: DEFAULT_USER_ID,
    bookId: createdBook._id,
    shelfIds: ["64a0c0b0c3f8fa2d1e4c0011", "64a0c0b0c3f8fa2d1e4c0002"],
    format: payload.userData.format,
  };

  const populatedToSendBack = { ...createdUserBook, bookId: createdBook };

  vi.spyOn(Book, "create").mockResolvedValueOnce(createdBook as any);
  vi.spyOn(UserBook, "findOne").mockResolvedValueOnce(null as any);
  vi.spyOn(UserBook, "create").mockResolvedValueOnce(createdUserBook as any);

  vi.spyOn(UserBook, "findOne").mockReturnValueOnce({
    populate: vi.fn().mockResolvedValueOnce(populatedToSendBack),
  } as any);

  const res = await request(app)
    .post("/books")
    .send(payload)
    .set("Content-Type", "application/json")
    .expect("Content-Type", /json/)
    .expect(201);

  expect(res.body.bookId.title).toBe(payload.title);
  expect(res.body.bookId.isbn).toBe(undefined);
});
