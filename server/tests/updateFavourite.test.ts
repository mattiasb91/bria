import { describe, test, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { userBook } from './mockData.js';

//MUST use 'vi.hoisted' for variables used inside 'vi.mock'
const { mockFindOneAndUpdate: mockFindOneAndUpdate } = vi.hoisted(() => ({
  mockFindOneAndUpdate: vi.fn()
}));

// Mock using the exact path used in the controller
vi.mock('../models/userBooks.js', () => ({
  default: {
    findByIdAndUpdate: mockFindOneAndUpdate
  }
}));

describe('updateUserBookFavorite Controller', () => {
  const URL = `/userbooks/${userBook.bookId}/favorite`; 
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('successfully toggles the favorite status', async () => {
    const updatefavorite = { favorite: false };
    const mockResponse = { ...userBook, ...updatefavorite };

    mockFindOneAndUpdate.mockResolvedValue(mockResponse);

    const res = await request(app)
      .put(URL) 
      .send(updatefavorite);

    expect(res.status).toBe(200);
    expect(res.body.favorite).toBe(false);
    expect(mockFindOneAndUpdate).toHaveBeenCalledWith(
      userBook.bookId,
      updatefavorite,
      {new : true}
    );
  });

  test('returns 500 when the database throws an error', async () => {
    mockFindOneAndUpdate.mockRejectedValue(new Error('DB Fail'));

    const res = await request(app)
      .put(URL)
      .send({ favorite: true });

    expect(res.status).toBe(500);
  });
});