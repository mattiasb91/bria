import app from "../app.js";
import request from "supertest";
import { expect, test,vi } from "vitest";
import UserBook from "../models/userBooks.js";


test("Get the usersbook's details", async () => {
  
  const mockFind = {
    sort: vi.fn().mockReturnThis(),
    populate: vi.fn().mockResolvedValue([{ title: "Mock Book", userId: "123" }])
  };
  vi.spyOn(UserBook, 'find').mockReturnValue(mockFind as any);
  const res = await request(app).get("/userbooks");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
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
