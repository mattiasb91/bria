import app from "../app.js";
import request from "supertest";
import { expect, test, vi, beforeEach } from "vitest";
import UserBook from "./../models/userBooks.js";
import { realBook } from "./mockData.js";

// cleanup
beforeEach(() => {
  vi.restoreAllMocks();
});

//tests for router.put("/userbooks/:id/owned", updateUserBookOwned);
//happy path. owned successfully updated
test("should update the specific book owned flag and return the updated book", async () => {
  const id = realBook.bookId;
  const ownedUpdate = { owned: false };

  const updatedBook = {
    ...realBook,
    owned: false,
    updatedAt: new Date().toISOString(),
  };
  console.log("testest");
  const res = await request(app)
    .put(`/userbooks/${id}/owned`)
    .send(ownedUpdate)
    .expect("Content-Type", /json/)
    .expect(200);
    console.log("logging here: ", res.status);

  // verify response
  expect(res.body.bookId).toEqual(updatedBook.bookId);
  expect(res.body.owned).toEqual(updatedBook.owned);
});

//unhappy path. DB update throws 500

test("should return 500 whe updating owned fails", async () => {
  const id = realBook.bookId;
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
