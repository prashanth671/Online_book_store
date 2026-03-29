# 📚 BookStore — Full-Stack MERN App

A complete online bookstore with authentication, cart, checkout, orders, and admin panel.

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB running locally **or** a MongoDB Atlas URI

---

### 1 — Backend setup

```bash
cd server
npm install
cp .env.example .env    # edit MONGO_URI and JWT_SECRET
npm run seed            # seed 12 books + 2 demo users
npm run dev             # → http://localhost:5000
```

### 2 — Frontend setup (new terminal)

```bash
cd client
npm install
npm run dev             # → http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## 🔑 Demo Accounts (after seeding)

| Role  | Email                    | Password      |
|-------|--------------------------|---------------|
| User  | `john@example.com`       | `password123` |
| Admin | `admin@bookstore.com`    | `admin123`    |

Both are also pre-filled in the Login page via the **Demo Accounts** buttons.

---

## ⚙️ Environment Variables

**server/.env**
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=change_this_to_a_long_random_string
NODE_ENV=development
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🗂️ Project Structure

```
bookstore/
├── server/
│   ├── config/db.js
│   ├── controllers/   authController · bookController · cartController · orderController
│   ├── middleware/    auth.js  (JWT protect + adminOnly)
│   ├── models/        User · Book · Order
│   ├── routes/        auth · books · cart · orders
│   ├── seed.js
│   └── server.js
│
└── client/src/
    ├── components/    Navbar · Footer · BookCard · Spinner · StarRating
    ├── context/       AuthContext · CartContext · ToastContext
    ├── pages/         Home · BookDetail · Cart · Checkout · Orders · Login · Register · AdminDashboard
    └── services/      api.js  (Axios + JWT interceptor)
```

---

## ✅ Features

- JWT auth (register / login / logout) with 7-day token
- Browse books — search (debounced 420ms), category filter, pagination
- Add to cart, update quantity, remove — all with optimistic UI
- Checkout with shipping address → places order → clears cart
- Order history with status badges
- Admin panel: add / edit / delete books; update order status
- Global toast notifications for every action
- Responsive — works on mobile, tablet, and desktop
- Password show/hide toggle on auth forms
- Cover image preview in admin modal
- Stale/deleted-book guard in cart

---

## 🌐 API Reference

| Method | Endpoint               | Auth     |
|--------|------------------------|----------|
| POST   | /api/auth/register     | public   |
| POST   | /api/auth/login        | public   |
| GET    | /api/auth/me           | user     |
| GET    | /api/books             | public   |
| GET    | /api/books/:id         | public   |
| POST   | /api/books             | admin    |
| PUT    | /api/books/:id         | admin    |
| DELETE | /api/books/:id         | admin    |
| GET    | /api/cart              | user     |
| POST   | /api/cart              | user     |
| PUT    | /api/cart/:bookId      | user     |
| DELETE | /api/cart/:bookId      | user     |
| DELETE | /api/cart/clear        | user     |
| POST   | /api/orders            | user     |
| GET    | /api/orders/my         | user     |
| GET    | /api/orders            | admin    |
| PUT    | /api/orders/:id/status | admin    |
