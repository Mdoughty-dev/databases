# 📰 NC News API

## 🔗 Hosted Version

**Live API:**
[https://databases-ty2f.onrender.com/api.articles](https://databases-ty2f.onrender.com/api/articles)

---

## 📌 Project Overview

The **NC News API** is a RESTful backend service built with **Node.js, Express, and PostgreSQL**.
It provides structured access to news platform data including **topics, users, articles, and comments**.

This project demonstrates:

* MVC-style separation of concerns
* PostgreSQL querying using `pg`
* Query validation and error handling
* Environment-based configuration
* Full test coverage using **Jest** and **Supertest**

The API is designed to be consumed by a front-end application.

---

## 🛠️ Tech Stack

* Node.js
* Express
* PostgreSQL
* pg
* Jest
* Supertest
* dotenv

---

## 📂 Available Endpoints

To view all endpoints and example responses:

```
GET /api
```

Core endpoints include:

* `GET /api/topics`
* `GET /api/users`
* `GET /api/articles`
* `GET /api/articles/:article_id`
* `PATCH /api/articles/:article_id`
* `GET /api/articles/:article_id/comments`
* `POST /api/articles/:article_id/comments`
* `DELETE /api/comments/:comment_id`

---

## 🔍 Query Parameters

### GET /api/articles

This endpoint supports optional query parameters for flexible data retrieval:

| Query     | Description                                                       | Default      |
| --------- | ----------------------------------------------------------------- | ------------ |
| `sort_by` | Column to sort by (e.g. `created_at`, `votes`, `author`, `title`) | `created_at` |
| `order`   | Sort order: `asc` or `desc`                                       | `desc`       |
| `topic`   | Filters articles by topic                                         | none         |

**Example:**

```
/api/articles?topic=coding&sort_by=votes&order=asc
```

Invalid query values return a **400 Bad Request**.
Requests for non-existent resources return **404 Not Found**.

---

## 🚀 Getting Started (Local Setup)

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Mdoughty-dev/databases.git
cd databases
```

---

### 2️⃣ Install Dependencies

```bash
npm install
```

---

## 🔐 Environment Variables

You must create **two** environment variable files in the root directory.

### `.env.development`

```env
PGDATABASE=nc_news
```

### `.env.test`

```env
PGDATABASE=nc_news_test
```

These files are excluded from version control via `.gitignore`.

---

## 🗄️ Database Setup & Seeding

Seed the development database:

```bash
npm run seed
```

Seed the production database (used by the hosted version):

```bash
npm run seed-prod
```

---

## 🧪 Running Tests

```bash
npm test
```

Tests are written using **Jest** and **Supertest** and run against the test database.

---

## ▶️ Running the Server

```bash
npm start
```

The server will listen on:

```
http://localhost:9090
```

---

## 📦 Minimum Requirements

| Tool       | Version  |
| ---------- | -------- |
| Node.js    | v18.0.0+ |
| PostgreSQL | v14.0+   |

---

## 🧠 Design Notes

* Follows an MVC-style architecture
* Uses parameterised SQL queries to prevent SQL injection
* Centralised error handling with Express middleware
* Separate environments for development, testing, and production
* Queries are validated to ensure predictable API behaviour

---

## 👤 Author

**Matthew Doughty**

