# Syntecxhub Data Analytics API

## Project Overview

A small analytics service that uses MongoDB Aggregation to produce reporting endpoints for blog data. It can run standalone or be integrated with an existing Blog API.

## Features

- Posts per author
- Posts per month
- Posts per category
- Date-range filtering for posts

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- dotenv, CORS

## Project Structure

```
data-analytics-api/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── analyticsController.js
│   ├── middleware/
│   │   └── error.js
│   ├── models/
│   │   ├── Post.js
│   │   └── User.js
│   ├── routes/
│   │   └── analyticsRoutes.js
│   └── server.js
├── seeder/seed.js
├── package.json
└── README.md
```

## Getting Started

1. Clone the repo

```bash
git clone <repo-url>
cd data-analytics-api
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file at the project root with at least:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dbname
```

4. Seed sample data (optional)

```bash
npm run seed
```

5. Start in development

```bash
npm run dev
```

## API Endpoints & Examples

All endpoints use GET and are mounted under `/api/analytics`.

- Posts per author

```bash
curl http://localhost:5000/api/analytics/posts-per-author
```

- Posts per month

```bash
curl http://localhost:5000/api/analytics/posts-per-month
```

- Posts per category

```bash
curl http://localhost:5000/api/analytics/posts-per-category
```

- Posts by date range (start and end are ISO dates)

```bash
curl "http://localhost:5000/api/analytics/posts-by-date?start=2024-01-01&end=2024-12-31"
```

Example JSON response (posts-per-author):

```json
[
  { "author": "Alice", "count": 12 },
  { "author": "Bob", "count": 7 }
]
```

## Usage / Testing

- Use Postman, HTTPie, or curl to call endpoints.
- Confirm `MONGO_URI` points to a database with `posts` and `users` collections when integrating with another API.

## Development Notes

- Aggregation pipelines live in `src/controllers/analyticsController.js`.
- Error handling middleware is in `src/middleware/error.js`.

## Author

Ayakha Mfengwana — Backend Development Intern

---
