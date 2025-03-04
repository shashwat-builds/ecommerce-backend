# E-Commerce Backend

## 🚀 Overview

This is the backend for an **E-Commerce** platform built using **Node.js, Express, MongoDB, and JWT authentication**. It supports **user authentication, product management, order processing, and Razorpay payment integration**.

---

## 📌 Features

- **User Authentication** (JWT-based login & registration)
- **Admin Role Management** (Restrict access to certain routes)
- **Product Management** (CRUD operations for products)
- **Cart Functionality** (Add, remove, update cart items)
- **Order Processing** (Place and manage orders)
- **Razorpay Payment Integration**
- **Email Notifications** (Order confirmation emails via Nodemailer)

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens)
- **Payment Gateway:** Razorpay
- **Email Service:** Nodemailer

---

## 🔧 Installation

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/ecommerce-backend.git
cd ecommerce-backend
```

### 2️⃣ Install Dependencies

```sh
npm install
```

### 3️⃣ Set Up Environment Variables

Create a `.env` file and configure the following:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4️⃣ Start the Server

```sh
npm start
```

---

## 🔑 API Endpoints

### 🔹 Authentication

| Method | Endpoint            | Description             | Access |
| ------ | ------------------- | ----------------------- | ------ |
| POST   | /api/users/register | Register a new user     | Public |
| POST   | /api/users/login    | Login and get JWT token | Public |

### 🔹 Products

| Method | Endpoint           | Description      | Access |
| ------ | ------------------ | ---------------- | ------ |
| GET    | /api/products      | Get all products | Public |
| POST   | /api/products      | Create a product | Admin  |
| PUT    | /api/products/\:id | Update a product | Admin  |
| DELETE | /api/products/\:id | Delete a product | Admin  |

### 🔹 Cart

| Method | Endpoint       | Description      | Access |
| ------ | -------------- | ---------------- | ------ |
| GET    | /api/cart      | Get cart items   | User   |
| POST   | /api/cart      | Add item to cart | User   |
| PUT    | /api/cart/\:id | Update cart item | User   |
| DELETE | /api/cart/\:id | Remove cart item | User   |

### 🔹 Orders

| Method | Endpoint                | Description         | Access |
| ------ | ----------------------- | ------------------- | ------ |
| POST   | /api/orders             | Place an order      | User   |
| GET    | /api/orders/\:id        | Get order details   | User   |
| PUT    | /api/orders/\:id/status | Update order status | Admin  |

---

## 🔒 Admin Access

To restrict routes, an **Admin Middleware** is used:

```javascript
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
  next();
};
```

To make a user an admin, set `isAdmin: true` in the database.


---

## 📝 License

This project is licensed under the **MIT License**.

---

## 🙌 Contributing

Pull requests are welcome! If you find a bug or want to improve the project, open an issue.

**Happy Coding! 🚀**

