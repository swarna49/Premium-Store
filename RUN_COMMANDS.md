# 🚀 How to Run the E-Commerce Application

## Prerequisites Check

Before running, make sure you have:
- ✅ Node.js installed (v14 or higher)
- ✅ MongoDB installed and running
- ✅ Git Bash or PowerShell

---

## Step 1: Install Dependencies

### Install Server Dependencies
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\server
npm install
```

### Install Client Dependencies
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\client
npm install
```

---

## Step 2: Start MongoDB

### Option A: MongoDB as Windows Service (Recommended)
```bash
# Start MongoDB service
net start MongoDB
```

### Option B: MongoDB Manually
```bash
# Navigate to MongoDB bin directory (adjust path if needed)
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod
```

### Option C: If MongoDB is not installed
Download and install from: https://www.mongodb.com/try/download/community

---

## Step 3: Configure Environment Variables

The `.env` file is already set up at `server\.env` with default values.

**⚠️ Important:** Update these values before running:

```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
STRIPE_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

For testing without Stripe, you can skip Stripe keys initially.

---

## Step 4: Run the Application

### Option A: Run Both Servers Simultaneously (Recommended)

**Open TWO separate PowerShell/Terminal windows:**

#### Terminal 1 - Backend Server
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\server
npm run dev
```

You should see:
```
Server running on port 5000
Environment: development
MongoDB Connected
```

#### Terminal 2 - Frontend Server
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\client
npm run dev
```

You should see:
```
ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Option B: Run with Production Build

#### Backend (Production)
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\server
npm start
```

#### Frontend (Production)
```bash
cd c:\users\samay\OneDrive\Desktop\ecommerce\client
npm run build
npm start
```

---

## Step 5: Access the Application

Once both servers are running:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/health

---

## Quick Start Commands (Copy & Paste)

### For PowerShell Users:

```powershell
# 1. Start MongoDB (if not running as service)
net start MongoDB

# 2. Open first terminal - Backend
cd c:\users\samay\OneDrive\Desktop\ecommerce\server
npm install
npm run dev

# 3. Open second terminal - Frontend
cd c:\users\samay\OneDrive\Desktop\ecommerce\client
npm install
npm run dev
```

### For Git Bash Users:

```bash
# 1. Backend
cd /c/users/samay/OneDrive/Desktop/ecommerce/server
npm install
npm run dev

# 2. Frontend (in new terminal)
cd /c/users/samay/OneDrive/Desktop/ecommerce/client
npm install
npm run dev
```

---

## Troubleshooting

### Issue: "MongoDB connection failed"
**Solution:**
```bash
# Check if MongoDB is running
net start MongoDB

# Or start manually
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod
```

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=5001
```

### Issue: "Port 3000 already in use"
**Solution:**
```powershell
# Find and kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Issue: "Module not found"
**Solution:**
```bash
# Reinstall dependencies
cd server
rm -rf node_modules package-lock.json
npm install

cd ../client
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Cannot find module 'next'"
**Solution:**
```bash
cd client
npm install next react react-dom
```

---

## Testing the Application

### 1. Test Backend Health
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{"status":"OK","message":"Server is running"}
```

### 2. Test Product API
```bash
curl http://localhost:5000/api/products
```

### 3. Register a User (via API)
```bash
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### 4. Create Admin User (via MongoDB)
```bash
# Connect to MongoDB
mongosh

# Use the database
use ecommerce

# Create admin user
db.users.insertOne({
  name: "Admin",
  email: "admin@example.com",
  password: "$2a$10$YourHashedPasswordHere",
  isAdmin: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

---

## Stripe Setup (Optional - for Payment Testing)

### 1. Get Stripe Keys
- Sign up at https://stripe.com
- Get your test API keys from Dashboard

### 2. Install Stripe CLI
```bash
# Download from: https://stripe.com/docs/stripe-cli
stripe login
```

### 3. Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:5000/api/orders/webhook
```

Copy the webhook signing secret to your `.env` file.

---

## Stopping the Application

### Stop Servers
Press `Ctrl + C` in each terminal window

### Stop MongoDB (if running manually)
Press `Ctrl + C` in MongoDB terminal

### Stop MongoDB Service
```bash
net stop MongoDB
```

---

## Development Workflow

### Making Changes

**Backend Changes:**
- Edit files in `server/` directory
- Server auto-restarts (using nodemon)

**Frontend Changes:**
- Edit files in `client/` directory
- Browser auto-refreshes (Next.js hot reload)

### Viewing Logs

**Backend logs:** Check the terminal running `npm run dev` in server
**Frontend logs:** Check browser console (F12)

---

## Production Deployment Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGO_URI` to production database
- [ ] Set `NODE_ENV=production`
- [ ] Add production Stripe keys
- [ ] Configure CORS for production domain
- [ ] Set up proper SSL/HTTPS
- [ ] Configure Stripe webhook endpoint
- [ ] Set up environment variables on hosting platform

---

## Need Help?

Check the following files:
- `README.md` - Full documentation
- `CHANGES.md` - List of all modifications
- `.env` - Environment configuration

**Common Commands Reference:**
```bash
npm install          # Install dependencies
npm run dev          # Run development server
npm start            # Run production server
npm run build        # Build for production (client only)
```

---

## 🎉 You're Ready!

Your application should now be running at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

Happy coding! 🚀
