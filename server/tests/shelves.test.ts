import request from "supertest";
import { userBook } from "./mockData.js";
import { expect, test, vi, beforeEach } from "vitest";
import app from "../app.js";
import UserBook from "./../models/userBooks.js";

// cleanup
beforeEach(() => {
  vi.clearAllMocks();
});

// tests for router.put("/userbooks/:bookId/shelves", updateUserBookShelves);
//happy path
test("should update the shelves listed in the book and return the updated book", async () => {
  const id = userBook.bookId;
  const shelvesUpdate = {
    shelves: [
      "64a0c0b0c3f8fa2d1e4c0012",
      "64a0c0b0c3f8fa2d1e4c0004",
    ]
  };

  //create a realistic updated version of the userBook mock:
  const updatedBook = {
    ...userBook,
    shelfIds: shelvesUpdate.shelves, // controller maps shelves -> shelfIds
    updatedAt: new Date().toISOString(),
  };

  //mock: when findOneAndUpdate is called, return updatedBook:
  const spy = vi.spyOn(UserBook, "findOneAndUpdate").mockResolvedValueOnce(updatedBook);

  const res = await request(app)
    .put(`/userbooks/${id}/shelves`)
    .send(shelvesUpdate)
    .expect("Content-Type", /json/);

    //check that returned object matches expected updated version:
    expect(res.status).toBe(200);
  expect(res.body.shelfIds).toEqual([
      "64a0c0b0c3f8fa2d1e4c0012",
      "64a0c0b0c3f8fa2d1e4c0004",
    ]);
    console.log("derp: ", spy.mock.calls);
  expect(res.body.bookId).toBe(updatedBook.bookId);
  expect(res.body.status).toBe(updatedBook.status);
  expect(spy).toHaveBeenCalledWith(
    { bookId: userBook.bookId },
    { shelfIds: shelvesUpdate.shelves },
    { new: true },
  );
});

//unhappy path second; send error when not succeeding to update book:

test("should return 500 when updating the book fails", async () => {
  const id = userBook.bookId;
  const shelvesUpdate = {
    shelves: [
      "64a0c0b0c3f8fa2d1e4c0012",
      "64a0c0b0c3f8fa2d1e4c0004",
    ]
  };

  const error = new Error("Database error");

  // Mock: this time we make it reject instead of resolve
  vi.spyOn(UserBook, "findOneAndUpdate").mockRejectedValueOnce(error);

  const res = await request(app)
    .put(`/userbooks/${id}/shelves`)
    .send(shelvesUpdate)
    .expect("Content-Type", /json/)

  expect(res.status).toBe(500);
});

