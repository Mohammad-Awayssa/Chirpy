# Chirpy

Chirpy is a RESTful backend API for a social media-style application built with **TypeScript, Node.js, Express, PostgreSQL, and Drizzle ORM**.

Users can create accounts, authenticate securely, create and manage chirps, follow other users, and receive Chirpy Red membership upgrades through authenticated webhooks.

## Features

* User registration and login
* Password hashing with Argon2
* JWT access-token authentication
* Refresh-token authentication and revocation
* Protected API endpoints
* Authorization and resource ownership checks
* Create, read, and delete chirps
* Filter chirps by author
* Sort chirps by creation date
* Chirpy Red membership support
* Polka webhook integration
* API-key authentication for webhooks
* PostgreSQL database with Drizzle ORM
* Database migrations
* Environment-based configuration
* RESTful API design

## Tech Stack

* **TypeScript**
* **Node.js**
* **Express**
* **PostgreSQL**
* **Drizzle ORM**
* **Argon2**
* **JWT**
* **Vitest**

## API

### Users

```text
POST   /api/users
PUT    /api/users
POST   /api/login
```

Users can register, log in, and update their email and password.

### Authentication

```text
POST   /api/login
POST   /api/refresh
POST   /api/revoke
```

The API uses short-lived JWT access tokens together with refresh tokens for continued authentication.

### Chirps

```text
GET    /api/chirps
GET    /api/chirps/:chirpId
POST   /api/chirps
DELETE /api/chirps/:chirpId
```

Chirps can be filtered by author:

```text
GET /api/chirps?authorId=<user-id>
```

and sorted by creation time:

```text
GET /api/chirps?sort=asc
GET /api/chirps?sort=desc
```

### Chirpy Red Webhooks

```text
POST /api/polka/webhooks
```

Polka sends authenticated webhooks when a user upgrades to Chirpy Red. The endpoint uses an API key to ensure that webhook requests come from the payment provider.

## Getting Started

### Requirements

* Node.js
* PostgreSQL
* npm

### Installation

Clone the repository and install dependencies:

```bash
git clone <https://github.com/Mohammad-Awayssa/Chirpy>
cd Chirpy
npm install
```

Create a `.env` file with the required configuration:

```env
DB_URL="postgres://postgres:password@localhost:5432/chirpy?sslmode=disable"
PLATFORM="dev"
JWT_SECRET="your-secret"
POLKA_KEY="your-polka-key"
```

Run the database migrations and start the development server:

```bash
npm run dev
```

The server runs on:

```text
http://localhost:8080
```

## Authentication

Protected endpoints expect a JWT access token in the `Authorization` header:

```text
Authorization: Bearer <access-token>
```

Polka webhooks use a separate API-key format:

```text
Authorization: ApiKey <api-key>
```

## Project Structure

```text
src/
├── api/          # API route handlers
├── db/           # Database schema and queries
├── app/          # Static application files
├── auth.ts       # Authentication utilities
├── config.ts     # Environment configuration
└── index.ts      # Express server
```

## What I Learned

This project provided practical experience building a backend REST API and working with:

* HTTP servers and REST APIs
* Express middleware and routing
* PostgreSQL and relational database design
* ORM-based database queries
* Authentication and authorization
* JWTs and refresh tokens
* Password hashing
* Webhooks and API keys
* Database migrations
* Input validation
* API testing and debugging

## Note

This project was built as part of the Boot.dev HTTP Servers course. It was created as a learning project to practice backend development concepts and should not be considered a production-ready social media platform.
