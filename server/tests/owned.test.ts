import request from "supertest";
import { userBook } from "./mockData.js";
import { expect, test, vi, beforeEach } from "vitest";
import app from "../app.js";
import UserBook from "./../models/userBooks.js";

// cleanup
beforeEach(() => {
  vi.clearAllMocks();
});

//tests for router.put("/userbooks/:id/owned", updateUserBookOwned);
//happy path. owned successfully updated
test("should update the specific book owned flag and return the updated book", async () => {
  const id = userBook.bookId;
  const ownedUpdate = { owned: false };

  const updatedBook = {
    ...userBook,
    owned: false,
    updatedAt: new Date().toISOString(),
  };

  vi.spyOn(UserBook, "findOneAndUpdate").mockResolvedValueOnce(updatedBook);

  const res = await request(app)
    .put(`/userbooks/${id}/owned`)
    .send(ownedUpdate)
    .expect("Content-Type", /json/);

  // verify response
  expect(res.status).toBe(200);
  expect(res.body.owned).toBe(false);
  expect(res.body.bookId).toBe(updatedBook.bookId);
  expect(res.body.owned).toBe(updatedBook.owned);

  /* expect(res.body.bookId).toEqual(updatedBook.bookId);
  expect(res.body.owned).toEqual(updatedBook.owned); */
});

//unhappy path. DB update throws 500

test("should return 500 whe updating owned fails", async () => {
  const id = userBook.bookId;
  const ownedUpdate = { owned: true };

  //mock:
  vi.spyOn(UserBook, "findOneAndUpdate").mockRejectedValueOnce(
    new Error("Database error"),
  );

  await request(app)
    .put(`/userbooks/${id}/owned`)
    .send(ownedUpdate)
    .expect("Content-Type", /json/)
    .expect(500);
});
