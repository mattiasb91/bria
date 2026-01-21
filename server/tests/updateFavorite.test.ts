import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';
import { userBook } from './mockData.js';
import UserBook from '../models/userBooks.js';

describe('updateUserBookFavorite Controller', () => {
  const URL = `/userbooks/${userBook.bookId}/favorite`;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successfully toggles the favorite status', async () => {
    const updatefavorite = { favorite: false };
    const mockResponse = { ...userBook, favorite: false };

    const spy = vi.spyOn(UserBook, "findOneAndUpdate").mockResolvedValueOnce(mockResponse);

    const res = await request(app)
      .put(URL)
      .send(updatefavorite);

    expect(res.status).toBe(200);
    expect(res.body.favorite).toBe(false);

    expect(spy).toHaveBeenCalledWith(
      { bookId: userBook.bookId },
      { favorite: false },
      { new: true }
    );
  });

  test('returns 500 when the database throws an error', async () => {
    vi.spyOn(UserBook, "findOneAndUpdate").mockRejectedValueOnce(new Error('DB Fail'));

    const res = await request(app)
      .put(URL)
      .send({ favorite: true });

    expect(res.status).toBe(500);
  });
});