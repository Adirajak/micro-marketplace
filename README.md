# 🛍️ Micro Marketplace

A full-stack marketplace app with Node.js backend, React web app, and React Native mobile app.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, JWT
- **Web**: React, React Router, Axios
- **Mobile**: React Native (Expo)

## Quick Start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # Edit with your MongoDB URI
npm run seed           # Seeds 10 products + 2 users
npm run dev            # Starts on http://localhost:5000
```

### 2. Web
```bash
cd web
npm install
npm start              # Opens http://localhost:3000
```

### 3. Mobile
```bash
cd mobile
npm install
npx expo start
```

## 🔑 Test Credentials
| User  | Email            | Password    |
|-------|------------------|-------------|
| Alice | alice@test.com   | password123 |
| Bob   | bob@test.com     | password123 |

## API Reference

| Method | Endpoint               | Auth | Description           |
|--------|------------------------|------|-----------------------|
| POST   | /auth/register         | No   | Register new user     |
| POST   | /auth/login            | No   | Login, returns JWT    |
| GET    | /auth/me               | Yes  | Get current user      |
| GET    | /products              | No   | List + search + page  |
| GET    | /products/:id          | No   | Single product        |
| POST   | /products              | Yes  | Create product        |
| PUT    | /products/:id          | Yes  | Update product        |
| DELETE | /products/:id          | Yes  | Delete product        |
| GET    | /favorites             | Yes  | Get user favorites    |
| POST   | /favorites/:productId  | Yes  | Add to favorites      |
| DELETE | /favorites/:productId  | Yes  | Remove from favorites |

### Query Parameters for GET /products
- `search` — Search by title or description
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 8)
- `category` — Filter by category
- `sort` — Sort by: createdAt, price_asc, price_desc, rating