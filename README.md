# N-Back Task

A gamified implementation of the 2-back version of the N-back task. A live demo is hosted on [Vercel](https://n-back-task-eosin.vercel.app/).

## Useful Scripts

- `npm install`: install all dependencies
- `npm run test:unit`: run unit test suite
- `npm run test:e2e`: run Playwright test suite
- `npm run dev`: run the app locally, at [http://localhost:5173/](http://localhost:5173/)

## Requirements Met

- User inserts their name and then the task begins
- The task ends after 2 errors or after a fixed number of letters
- Once completed the app shows the number of errors and the number of correct answers
- A mock interaction with an `/event` API, demonstrated with a toast
- UI is mobile compatible
