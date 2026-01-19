import app from "../index.js";
import request from "supertest";
import { expect, test, vi, afterEach } from "vitest";
import UserBook from "./../models/userBooks.js";
import { userBook } from "./mockData.js";

// cleanup
afterEach(() => {
  vi.restoreAllMocks();
});

// test to test the router.put("/userbooks/:id/status", updateUserBookStatus)
//Happy path first: book status successfully updated:

test("should update the specific book status and return the updated book", async () => {
  const id = userBook._id;

  const statusUpdate = { status: "reading" };

  // create a realistic updated version of your userBook mock
  const updatedBook = {
    ...userBook,
    status: "reading",
    updatedAt: new Date().toISOString(), // fresh timestamp
  };

  // time to mock. when findbyidandupdate is called, return updatedBook:
  vi.spyOn(UserBook, "findByIdAndUpdate").mockResolvedValueOnce(updatedBook);

  const res = await request(app)
    .put(`/userbooks/${id}/status`)
    .send(statusUpdate)
    .expect("Content-Type", /json/)
    .expect(200);

  // assert returned object matches expected updated version
  expect(res.body).toEqual(updatedBook);
});

//unhappy path second; send error when not succeeding to update book:

test("should return 500 when updating the book fails", async () => {
  const id = userBook._id;
  const statusUpdate = { status: "reading" };

  const error = new Error("Database error");

  // Mock: this time we make it reject instead of resolve
  const spy = vi
    .spyOn(UserBook, "findByIdAndUpdate")
    .mockRejectedValueOnce(error);

  const res = await request(app)
    .put(`/userbooks/${id}/status`)
    .send(statusUpdate)
    .expect("Content-Type", /json/)
    .expect(500); // we expect a server error now
});
