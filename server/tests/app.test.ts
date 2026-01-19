import app from "../index.js";
import request from "supertest";
import { expect, test } from "vitest";

test("Get the usersbook's details", async () => {
  const res = await request(app)
    .get("/userbooks")
    .expect("Content-Type", /json/)
    .expect(200);
  expect(res.body);
});

test("should return 404 and JSON for non-existent routes", async () => {
  const res = await request(app)
    .get("/userbooks-invalid-path")
    .expect("Content-Type", /json/)
    .expect(404);
  expect(res.body).toEqual({
    message: "Not Found",
  });
});

// Test userbooks update status

// Post request successful creation
// Post request failed creation

//Db connection  failed and successful attempt

//use mock db data
