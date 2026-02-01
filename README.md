# ✨ Premium Store - Full Stack E-commerce Application

[![Next.js](https://img.shields.io/badge/Framework-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-blue?style=for-the-badge&logo=stripe)](https://stripe.com/)

A state-of-the-art, high-performance E-commerce platform built with a **Consolidated Full-Stack Architecture**. This project delivers a premium shopping experience with a powerful, integrated Admin Dashboard.

---

## 🚀 Key Features

| Feature | Description |
| :--- | :--- |
| **🛍️ Premium Storefront** | Responsive design with smooth transitions and glassmorphism aesthetics. |
| **🛡️ Auto-Admin System** | Intelligent login detection that redirects administrators to the Dashboard. |
| **📊 Analytics Suite** | Real-time tracking of users, stock levels, and product performance. |
| **📦 Dynamic Management** | Full CRUD operations (Create, Read, Update, Delete) for products. |
| **💳 Seamless Checkout** | Integrated Stripe payment gateway for secure global transactions. |

---

## 🛠️ Technology Stack

- **Frontend**: React.js with Next.js 13+
- **Backend API**: Next.js Serverless API (Node.js)
- **Database**: MongoDB with Mongoose ODM
- **Security**: JWT Authentication & Bcrypt Password Hashing
- **Icons & UI**: Modern Emoji & Custom Vanilla CSS

---

## 🏁 Fast Installation Guide

Setting up your own instance is designed to be effortless:

### 1. Clone & Install
```bash
git clone https://github.com/swarna49/Premium-Store.git
cd client
npm install
```

### 2. Configure Environment
Create a `.env.local` file in the root of the `/client` folder:
```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_key
STRIPE_KEY=your_stripe_secret_key
```

### 3. Launch the Application
```bash
npm run dev
```
Navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 📂 Project Navigation

- **`/pages`**: User Interface and Screen Components.
- **`/pages/api`**: Consolidated Backend logic and Database endpoints.
- **`/models`**: Schema definitions for Users, Products, and Orders.
- **`/utils`**: Core utilities including the Database connection engine.

---
**Premium Store** – *Crafted for Excellence.*
