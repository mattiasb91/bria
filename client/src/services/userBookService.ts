'use strict';

const url: string = 'http://localhost:3000';

//mimics the enums of the DB
export type BookStatus = 'not reading' | 'reading' | 'read'
export type BookFormat = '' | 'physical' | 'kindle' | 'audiobook'

export interface UserBook {
  userId: string;
  bookId: string;
  shelfIds: string[];
  progress: number;
  readCount: number;
  read: boolean;
  owned: boolean;
  favorite: boolean;
  status: BookStatus;
  format: BookFormat[];
  createdAt?: string;
  updatedAt?: string;
}



async function updateProgress(bookId: string, progress: number): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/progress`, {
    method: "PUT",
    body: JSON.stringify({ progress }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateProgress');
  }
  return await res.json();
}

async function updateStatus(bookId: string, status: BookStatus): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateStatus');
  }
  return await res.json();
}

async function updateOwned(bookId: string, owned: boolean): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/owned`, {
    method: "PUT",
    body: JSON.stringify({ owned }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateOwned');
  }
  return await res.json();
}

async function updateFavorite(bookId: string, favorite: boolean): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/favorite`, {
    method: "PUT",
    body: JSON.stringify({ favorite }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateFavorite');
  }
  return await res.json();
}

async function updateFormat(bookId: string, format: BookFormat[]): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/format`, {
    method: "PUT",
    body: JSON.stringify({ format }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateFormat');
  }
  return await res.json();
}

async function updateShelves(bookId: string, shelves: string[]): Promise<UserBook> {
  const res = await fetch(`${url}/userbooks/${bookId}/shelves`, {
    method: "PUT",
    body: JSON.stringify({ shelves }),
    headers: { "Content-Type": "application/json" }
  });
  if (!res.ok) {
    throw new Error('There was an error fetching the data - updateShelves');
  }
  return await res.json();
}

export {
  updateProgress,
  updateStatus,
  updateOwned,
  updateFavorite,
  updateFormat,
  updateShelves,
};