import app from "../index.js";
import request from "supertest";
import { expect, test } from 'vitest'


    
    test("Get the usersbook's details", async () => {
        const  res = await request(app)
        .get("/userbooks")
        .expect("Content-Type", /json/)
        .expect(200);
        expect(res.body)
    })