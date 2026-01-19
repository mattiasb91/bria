import app from "../index.js";
import request from "supertest";
import { expect, test, vi, afterEach } from "vitest";
import UserBook from "./../models/userBooks.js";
import { userBook } from "./mockData.js";

// cleanup
afterEach(() => {
  vi.restoreAllMocks();
});

//tests for router.put("/userbooks/:id/owned", updateUserBookOwned);
//happy path. owned successfully updated
test("should update the specific book owned flag and return the updated book", async () => {
  const id = userBook._id;
  const ownedUpdate = { owned: false };

  const updatedBook = {
    ...userBook,
    owned: false,
    updatedAt: new Date().toISOString(),
  };

  const res = await request(app)
    .put(`/userbooks/${id}/owned`)
    .send(ownedUpdate)
    .expect("Content-Type", /json/)
    .expect(200);

  // verify response
  expect(res.body).toEqual(updatedBook);
});

//unhappy path. DB update throws 500

test("should return 500 whe updating owned fails", async () => {
  const id = userBook._id;
  const ownedUpdate = { owned: true };

  //mock:
  vi.spyOn(UserBook, "findByIdAndUpdate").mockRejectedValueOnce(
    new Error("Database error"),
  );

  await request(app)
    .put(`/userbooks/${id}/owned`)
    .send(ownedUpdate)
    .expect("Content-Type", /json/)
    .expect(500);
});
