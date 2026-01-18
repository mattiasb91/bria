// tests/db.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';

vi.mock('mongoose', () => ({
  default: {
    connect: vi.fn(),
  },
}));

describe('Database Connection Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // Resets the spies before each test
  });

  it('Happy Path: should log success when connection is established', async () => {
    // Simulate mongoose.connect succeeding
    vi.mocked(mongoose.connect).mockResolvedValueOnce(undefined as any);
    const consoleSpy = vi.spyOn(console, 'log');

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Connected to db:", expect.any(String));
  });

  it('Sad Path: should log "Connection failed" when mongoose throws an error', async () => {
    // Simulate a connection error
    vi.mocked(mongoose.connect).mockRejectedValueOnce(new Error('Network Error'));
    const consoleSpy = vi.spyOn(console, 'log');

    await connectDB();

    expect(mongoose.connect).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Connection failed');
  });
});