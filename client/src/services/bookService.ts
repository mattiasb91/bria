"use strict";

import {
  getBookByEditionKey,
  getBookByWorksKey,
  getBookByIsbn,
} from "./apiService.js";

const localUrl = "http://localhost:3000";

//------types and interfaces-----

// type for the different formats the userbook can have:
type BookFormat = "" | "physical" | "kindle" | "audiobook";

// interface for the request body:
interface BookReqBody {
  worksKey?: string;
  editionKey?: string;
  isbn?: string;
  title: string;
  authors: string[];
  pages?: number | null;
  cover?: number | null;
  publishedDate?: Date | null;
  description?: string;
  genres?: string[];
  rating?: number;
  userData?: {
    format: BookFormat[];
    shelfIds?: string[];
  };
}

//minimal shape of the userbook returned from backend:
interface UserBook {
  _id: string;
  userId: string;
  bookId: {
    _id: string;
    title: string;
    authors: string[];
  };
}

//--------exported functions------------

//function to create a new book in database and return userbook

async function postBook(bookData: BookReqBody): Promise<UserBook> {
  console.log("bookData in postbook in bookservice: ", bookData);

  const book = await buildBookObject(bookData);
  console.log("book: ", book);

  const res = await fetch(`${localUrl}/books`, {
    method: "POST",
    body: JSON.stringify(book),
    headers: { "Content-Type": "application/json" },
  });

  console.log("res: ", res);

  if (!res.ok) {
    throw new Error("There was an error fetching the data - PostBook");
  }

  const data = (await res.json()) as UserBook;
  console.log("data: ", data);
  return data;
}
// function to get userbook array

async function getUserBooks(): Promise<UserBook[]> {
  const res = await fetch(`${localUrl}/books`);
  console.log(res);

  if (!res.ok) {
    throw new Error("There was an error fetching the data - GetBooks");
  }

  const data = (await res.json()) as UserBook[];
  return data;
}

export { postBook, getUserBooks };

//----------the helper function --------------

//helper function to get additional book data and rebuild book object

async function buildBookObject(book: any): Promise<BookReqBody> {
  console.log("book in build object at beginning: ", book);

  const editionKey: string = book.cover_edition_key || "";
  console.log("editionkey: ", editionKey);

  const worksKey: string = book.key?.split("/").pop() || "";
  console.log("workskey: ", worksKey);

  let editionData: any = {};
  let worksData: any = {};

  if (editionKey) {
    try {
      editionData = await getBookByEditionKey(editionKey);
    } catch (error) {
      console.log(error);
    }
  }
  if (worksKey) {
    try {
      worksData = await getBookByWorksKey(worksKey);
    } catch (error) {
      console.log(error);
    }
  }

  if (book.isbn && !editionKey) {
    try {
      const searchResults = await getBookByIsbn(book.isbn);
      if (searchResults.numFoundExact) {
        const foundBook = searchResults.docs[0];

        //merge foundbook and original book
        book = { ...foundBook, ...book };

        const newEditionKey = foundBook.cover_edition_key;
        const newWorksKey = foundBook.key?.split("/").pop();

        if (newEditionKey) {
          try {
            editionData = await getBookByEditionKey(newEditionKey);
          } catch (error) {
            console.log(error);
          }
        }

        if (newWorksKey) {
          try {
            worksData = await getBookByWorksKey(newWorksKey);
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  console.log("edition book data: ", editionData);
  console.log("works book data: ", worksData);

  console.log("title: ", book.title);
  console.log("author: ", book.author_name || book.authors);
  console.log(
    "isbn: ",
    editionData.isbn_13?.[0] || editionData.isbn_10?.[0] || "",
  );
  console.log("editionkey: ", editionKey || "");
  console.log("workskey: ", worksKey || "");
  console.log("pages: ", editionData.number_of_pages || null);
  console.log("description: ", worksData?.description?.value || "");
  console.log(
    "published date: ",
    book.publishedDate || book.first_publish_year
      ? new Date(`${book.first_publish_year}-01-01`)
      : null,
  );
  console.log("cover: ", book.cover_i || null);

  const isbn = editionData.isbn_13?.[0] || editionData.isbn_10?.[0];

  if (!book.userData) {
    console.log("no user data");
    //build empty user data if added not manually
    book.userData = {
      format: [""],
      shelfIds: ["64a0c0b0c3f8fa2d1e4c0011", " 64a0c0b0c3f8fa2d1e4c0002"],
    };
  }

  const newBook: BookReqBody = {
    title: book.title,
    authors: book.author_name || book.authors,
    editionKey: editionKey || "",
    worksKey: worksKey || "",
    pages: editionData.number_of_pages || null,
    description: worksData?.description?.value || "",
    publishedDate:
      book.publishedDate || book.first_publish_year
        ? new Date(`${book.first_publish_year}-01-01`)
        : null,
    cover: book.cover_i || null,
    userData: book.userData,
  };

  if (isbn) {
    newBook.isbn = isbn;
  } else {
    if (book.isbn?.trim()) {
      newBook.isbn = book.isbn.trim();
    } else {
      delete newBook.isbn;
    }
  }

  console.log("newBook: ", newBook);
  return newBook;
}
