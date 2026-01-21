import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { book, userBook } from './mockData.js';
import UserBook from '../models/userBooks.js';
import { format } from 'node:path';


describe('updateUserBookFormat Controller', () => {
  const URL = `/userbooks/${userBook.bookId}/format`;
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successfully changes the format', async () => {
    const updateformat = { format: 'kindle' };
    const mockResponse = { ...userBook, ...updateformat };

   const spy = vi.spyOn(UserBook,"findOneAndUpdate").mockResolvedValueOnce(mockResponse);

    const res = await request(app)
      .put(URL) 
      .send(updateformat);

    expect(res.status).toBe(200);
    expect(res.body.format).toBe('kindle');
    expect(spy).toHaveBeenCalledWith(
      {bookId: userBook.bookId}, 
      {format: 'kindle'},
      {new: true }
    );
  });

  test('returns 500 when the database throws an error', async () => {
    vi.spyOn(UserBook, "findOneAndUpdate").mockRejectedValueOnce(new Error('DB Fail'));

    const res = await request(app)
      .put(URL)
      .send({ format: 'physical' });

    expect(res.status).toBe(500);
  });
});