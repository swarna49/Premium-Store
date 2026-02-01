# E-Commerce Application

A full-stack e-commerce application built with Node.js, Express, MongoDB, Next.js, and Stripe for payments.

## Features

### Backend
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Product management (CRUD operations)
- ✅ Order management with Stripe integration
- ✅ Secure payment processing via Stripe webhooks
- ✅ Role-based access control (Admin/User)
- ✅ Comprehensive error handling
- ✅ MongoDB with Mongoose ODM

### Frontend
- ✅ Modern, responsive UI with Next.js
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Secure checkout with Stripe
- ✅ Order history tracking
- ✅ User authentication

## Tech Stack

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payments

**Frontend:**
- Next.js
- React
- Axios
- Styled JSX

## Project Structure

```
ecommerce/
├── server/
│   ├── config/
│   │   └── db.js              # Database connection
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── product.js         # Product schema
│   │   └── order.js           # Order schema
│   ├── routes/
│   │   ├── userRoutes.js      # User routes (register, login)
│   │   ├── productRoutes.js   # Product CRUD routes
│   │   └── orderRoutes.js     # Order and payment routes
│   ├── .env                   # Environment variables
│   ├── server.js              # Server entry point
│   └── package.json
│
└── client/
    ├── pages/
    │   └── index.js           # Home page
    ├── utils/
    │   └── api.js             # Axios instance
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Stripe account

### Backend Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key
STRIPE_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The client will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders/checkout` - Create checkout session (Authenticated)
- `POST /api/orders/webhook` - Stripe webhook endpoint
- `GET /api/orders/my-orders` - Get user's orders (Authenticated)
- `GET /api/orders/:id` - Get single order (Authenticated)
- `GET /api/orders` - Get all orders (Admin only)
- `PATCH /api/orders/:id/status` - Update order status (Admin only)

## Stripe Webhook Setup

1. Install Stripe CLI:
```bash
stripe login
```

2. Forward webhooks to local server:
```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

3. Copy the webhook signing secret to your `.env` file as `STRIPE_WEBHOOK_SECRET`

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication with expiration
- Protected routes with authentication middleware
- Role-based access control
- Input validation on all routes
- CORS configuration
- Secure payment processing via Stripe

## Future Enhancements

- [ ] Product categories and filtering
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product inventory management
- [ ] Multiple payment methods
- [ ] Shipping tracking
- [ ] Discount codes and promotions

## License

ISC

## Author

Your Name
