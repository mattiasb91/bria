import app from "../app.js";
import request from "supertest";
import { expect, test, vi, afterEach } from "vitest";
import UserBook from "./../models/userBooks.js";
import { userBook } from "./mockData.js";

// cleanup
afterEach(() => {
  vi.clearAllMocks();
});

// test to test the router.put("/userbooks/:id/status", updateUserBookStatus)
//Happy path first: book status successfully updated:

test("should update the specific book status and return the updated book", async () => {
  const id = userBook.bookId;

  const statusUpdate = { status: "reading" };

  // create a realistic updated version of your userBook mock
  const updatedBook = {
    ...userBook,
    status: "reading",
    updatedAt: new Date().toISOString(), // fresh timestamp
  };

  // time to mock. when findbyidandupdate is called, return updatedBook:
  const spy = vi
    .spyOn(UserBook, "findOneAndUpdate")
    .mockResolvedValueOnce(updatedBook);

  const res = await request(app)
    .put(`/userbooks/${id}/status`)
    .send(statusUpdate)
    .expect("Content-Type", /json/);

  // assert returned object matches expected updated version

  expect(res.status).toBe(200);
  expect(res.body.status).toBe("reading");
  expect(res.body.bookId).toBe(updatedBook.bookId);
  expect(res.body.status).toBe(updatedBook.status);
  expect(spy).toHaveBeenCalledWith(
    { bookId: userBook.bookId },
    { status: "reading" },
    { new: true },
  );
});

//unhappy path second; send error when not succeeding to update book:

test("should return 500 when updating the book fails", async () => {
  const id = userBook.bookId;
  const statusUpdate = { status: "reading" };

  const error = new Error("Database error");

  // Mock: this time we make it reject instead of resolve
  vi.spyOn(UserBook, "findOneAndUpdate").mockRejectedValueOnce(error);

  const res = await request(app)
    .put(`/userbooks/${id}/status`)
    .send(statusUpdate)
    .expect("Content-Type", /json/)

  expect(res.status).toBe(500);
});
