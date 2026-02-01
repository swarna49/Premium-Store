# 🛍️ My First Online Store (Premium Store)

Welcome! This is a simple but powerful "Full-Stack" website. Full-stack means it has both a **Frontend** (the part you see and click) and a **Backend** (the brain that remembers your users and products).

## 🌟 What can this website do?

- **Shop for Items**: Look at beautiful products and add them to a cart.
- **Join as a Member**: You can create an account and log in.
- **Secret Admin Power**: If you log in with an Admin account, the website automatically takes you to a secret **Dashboard** where you can:
  - Add new products to the store.
  - Delete items you don't want to sell anymore.
  - See all the people who have signed up.
- **Real Payments**: It uses "Stripe" to handle money safely.

## 🛠️ The "Building Blocks" (Tech Stack)

If you are new to coding, here are the tools I used:
1. **Next.js**: The main frame of the house. It handles the website and the brain at the same time.
2. **MongoDB**: The "Digital Notebook" where we save all our product and user information.
3. **Vanilla CSS**: The "Paint" that makes the website look premium and pretty.
4. **Stripe**: The "Cashier" that handles payments.

## 🚀 How to run this on your computer

Follow these simple steps:

### 1. Get the code
Download this folder to your computer.

### 2. Install the tools
Open your terminal (Command Prompt) inside the `client` folder and type:
```bash
npm install
```
*Wait for it to finish! This downloads all the logic needed for the site.*

### 3. Start the project
Type this next:
```bash
npm run dev
```

### 4. See the magic
Open your browser and type: **http://localhost:3000**

---

## 📂 Where is everything? (Folder Guide)

- **`pages/`**: These are the different screens (Login page, Admin page, Shop page).
- **`pages/api/`**: This is the "Brain" of the website that talks to the database.
- **`models/`**: This is where we define what a "User" or a "Product" looks like.
- **`public/`**: This holds the images and logos.

---
**Happy Shopping!** ✨
