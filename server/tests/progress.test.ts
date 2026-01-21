import request from "supertest";
import { realBook } from "./mockData.js";
import { expect, test, vi, beforeEach } from "vitest";
import app from "../app.js";
import UserBook from "./../models/userBooks.js";

// cleanup
beforeEach(() => {
  vi.clearAllMocks();
});

// tests for router.put("/userbooks/:bookId/progress", updateUserBookProgress);

// happy path: progress successfully updated
test("should update the specific book progress and return the updated book", async () => {
  const bookId = realBook.bookId;
  const progressUpdate = { progress: 10 };

  const updatedBook = {
    ...realBook,
    progress: 10,
    updatedAt: new Date().toISOString(),
  };

  vi.spyOn(UserBook, "findByIdAndUpdate").mockResolvedValueOnce(updatedBook);

  const res = await request(app)
    .put(`/userbooks/${bookId}/progress`)
    .send(progressUpdate)
    .expect("Content-Type", /json/);

  // verify response
  expect(res.status).toBe(200);
  expect(res.body.progress).toBe(10);
});

// unhappy path: DB update throws 500
test("should return 500 when updating progress fails", async () => {
  const bookId = realBook.bookId;
  const progressUpdate = { progress: 10 };

  vi.spyOn(UserBook, "findByIdAndUpdate").mockRejectedValueOnce(
    new Error("Database error"),
  );

  await request(app)
    .put(`/userbooks/${bookId}/progress`)
    .send(progressUpdate)
    .expect("Content-Type", /json/)
    .expect(500);
});
