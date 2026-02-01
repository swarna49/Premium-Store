# ✨ Premium Store - Full Stack E-commerce

A modern, fast, and premium e-commerce platform built with **Next.js**, **MongoDB**, and **Stripe**. This project features a consolidated architecture where the frontend and backend live together for maximum stability.

## 🚀 Features

- **🛒 Modern Storefront**: High-performance shopping experience with smooth animations.
- **🛡️ Admin Dashboard**: Manage your business with ease:
  - **📊 Stats**: Track users, products, and stock levels.
  - **📦 Product Management**: Create, edit, and delete products easily.
  - **👥 User Database**: View all registered customers.
- **🔑 Smart Auth**: Automatic redirection for admins. Regular users go to the shop; admins go to the dashboard.
- **💳 Secure Payments**: Integrated with Stripe for safe transactions.
- **📱 Responsive Design**: Looks great on phones, tablets, and desktops.

## 🛠️ Tech Stack

- **Frontend & Backend**: Next.js (React)
- **Database**: MongoDB (Mongoose)
- **Styling**: Vanilla CSS (Premium Glassmorphism Design)
- **Auth**: JWT (JSON Web Tokens) & Bcrypt
- **Payments**: Stripe API

## 🏁 Quick Start

### 1. Installation
Clone the repository and install dependencies:
```bash
cd client
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the `client` folder:
```text
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_KEY=your_stripe_key
```

### 3. Run the App
Start the development server:
```bash
npm run dev
```
Open **http://localhost:3000** in your browser.

## 📁 Project Structure

- `/pages/api`: Backend logic and database routes.
- `/pages`: Frontend screens (Store, Login, Admin).
- `/models`: Database blueprints for Users, Products, and Orders.
- `/utils`: Helper functions and database connection.

---
Built with ❤️ by [Premium Store Team]
