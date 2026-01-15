## Original project

Type the original solo project name and repo URL that you want to work on.

**Answer:**  BRIA [GitHub - luanadefourny/bria: BRIA webapp](https://github.com/luanadefourny/bria)

## Team members

Add a list of all the members in your team.

**Answer:** Mattias, Thanh, Michi

## Your repository

Fork the original repo on GitHub, give write access to your team members, and paste the fork URL here.

**Answer:** [GitHub - mattiasb91/bria: BRIA webapp](https://github.com/mattiasb91/bria)

## Reliability improvements

Provide a short description of the reliability improvements that you plan to execute on the project (e.g. “Front End: We’re going to refactor the code to decouple data fetching from components, adding a middleware layer. Back End: We’re going to add unit tests for the app controllers, and write documentation on how to set up the server.”)

**Front End:** 

Migrate  front-end service-files to TypeScript for better type safety and error catching.

debug userbookservice.js (throwing many errors in console)

Fix ReferenceError in userBookService.js to ensure variables are initialized before use during status updates.

Refactor useEffect and state management in the book popup to allow status changes (e.g., "reading" to "read") to persist without closing the window.

Resolve CSS overlap issues to ensure the search bar and navigation menu are responsive on narrow screens.

Smart Suggestions: Fix the "Pick Next Book" logic to properly suggest "To Read" books and exclude already "Owned" books from "To Buy" suggestions.

UI Polish: Remove "Hello World" placeholders and fix spacing/gaps between images on the home page.

**FE-tests:**

state management for the book popup to ensure reading to read updates correctly

**Back End:** 

Migrate the back-end architecture to TypeScript.

Implement data validation to prevent duplicate book entries (e.g., the "Hail Mary" issue).

Correct the database population logic to ensure the genres field is correctly filled or removed if no longer supported by the Open Library API.

Refactor the seed.js file to remove cluttered comments and unused functions for a cleaner mock data process.

Fix environment configuration by documenting that the .env file must reside in the root folder to prevent connection issues.

Delete Controller: Finalize and test the deleteUserBook function to support the front-end remove feature.

Cleanup: Remove unused code and legacy endpoints from apiService and index.js.

**BE-tests:**

ensure database connection

test for database duplicates

**FE-BE tests:**

**New features:**

Library Management: Add a "remove/bin" button to allow users to delete books from their library.

Ownership Indicators: Add a header/label under owned books to specify format (Physical, Kindle, or Audiobook).

Favorites Logic: Implement functional logic for the "Favorite" button to allow users to curate their top books.
