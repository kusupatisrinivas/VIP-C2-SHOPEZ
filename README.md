# 🛒 ShopEZ - Full Stack E-Commerce Application

ShopEZ is a modern full-stack e-commerce web application developed using the MERN Stack (MongoDB, Express.js, React.js, and Node.js). The platform provides a complete online shopping experience with product browsing, cart management, order placement, authentication, and an admin dashboard for managing products and orders.

---

## 🚀 Features

### Customer Features

* User Registration and Login
* JWT-Based Authentication
* Browse Products by Category
* Product Search Functionality
* Product Details Page
* Add to Cart
* Manage Cart Items
* Place Orders
* View Order History
* Responsive User Interface

### Admin Features

* Admin Authentication
* Product Management
* Category Management
* Banner Management
* Order Monitoring
* User Management

---

## 🛠️ Technology Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Authentication

* JSON Web Token (JWT)
* Protected Routes
* Role-Based Access Control

---

## 📂 Project Structure

```text
SHOP-EZ
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│
├── server/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/ShopEZ.git
cd ShopEZ
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `server` folder:

```env
PORT=8000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_SECRET=YOUR_SECRET_KEY
JWT_EXPIRES_IN=7d
```

---

## ▶️ Running the Application

### Start Backend Server

```bash
cd server
npm start
```

### Start Frontend Server

```bash
cd client
npm start
```

Frontend:

```text
http://localhost:3000
```

Backend:

```text
http://localhost:8000
```

---

## 📡 API Modules

### Authentication

* Register User
* Login User

### Products

* Get All Products
* Get Product Details
* Search Products
* Filter by Category

### Cart

* Add to Cart
* Update Quantity
* Remove Item

### Orders

* Place Order
* View Orders

### Admin

* Manage Products
* Manage Categories
* Manage Banners
* Manage Orders

---

## 🔒 Security Features

* Password Hashing
* JWT Authentication
* Protected Routes
* Role-Based Authorization
* Input Validation

---

## 📸 Screenshots

Add screenshots of:

* Home Page
* Product Listing
* Product Details
* Cart Page
* Orders Page
* Admin Dashboard

---

## 🎯 Future Enhancements

* Online Payment Gateway Integration
* Wishlist Functionality
* Product Reviews and Comments
* Email Notifications
* Advanced Analytics Dashboard
* Product Recommendation System
* Dark Mode Support

---

## 👨‍💻 Developer

**Kusupati Srinivas**

B.Tech Computer Science Engineering
Anurag University

---

## 📜 License

This project is developed for educational and learning purposes.
