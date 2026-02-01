# 📋 Quick Reference Card

## 🚀 **How to Start Your App**

### **Easiest Way (Recommended):**
```bash
# Just double-click this file:
start-dev.bat
```

### **Manual Way:**
```bash
# Terminal 1 - Backend
cd c:\users\samay\OneDrive\Desktop\ecommerce\server
npm run dev

# Terminal 2 - Frontend
cd c:\users\samay\OneDrive\Desktop\ecommerce\client
npm run dev
```

---

## 🌐 **URLs to Access**

| Service | URL |
|---------|-----|
| **Frontend (Website)** | http://localhost:3000 |
| **Backend API** | http://localhost:5000/api |
| **Health Check** | http://localhost:5000/health |

---

## 🛠️ **Common Issues & Quick Fixes**

| Problem | Solution |
|---------|----------|
| Port 5000 busy | Double-click `kill-port-5000.bat` |
| Port 3000 busy | Double-click `kill-port-3000.bat` |
| MongoDB not running | Run: `net start MongoDB` |
| Need fresh start | Double-click `start-dev.bat` |

---

## 📁 **Important Files**

| File | What It Does |
|------|--------------|
| `start-dev.bat` | Starts both servers automatically |
| `setup.bat` | Installs all dependencies (first time) |
| `kill-port-5000.bat` | Frees up backend port |
| `kill-port-3000.bat` | Frees up frontend port |
| `server\.env` | Backend configuration |
| `README.md` | Full documentation |
| `TROUBLESHOOTING.md` | Detailed problem solving |
| `RUN_COMMANDS.md` | All commands explained |

---

## 🔑 **API Endpoints**

### **Public (No Auth Required):**
- `POST /api/users/register` - Create account
- `POST /api/users/login` - Login
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get one product

### **Authenticated (Login Required):**
- `POST /api/orders/checkout` - Create order
- `GET /api/orders/my-orders` - Your orders
- `GET /api/orders/:id` - Order details

### **Admin Only:**
- `POST /api/products` - Add product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/orders` - All orders
- `PATCH /api/orders/:id/status` - Update order status

---

## 💡 **Pro Tips**

1. **Always start MongoDB first:**
   ```bash
   net start MongoDB
   ```

2. **Use `start-dev.bat` to avoid port conflicts**
   - It automatically kills old processes
   - Starts both servers in separate windows

3. **Check server status:**
   ```bash
   curl http://localhost:5000/health
   ```

4. **View what's running on ports:**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :3000
   ```

5. **Emergency restart:**
   ```bash
   taskkill /IM node.exe /F
   start-dev.bat
   ```

---

## 📊 **Server Status Indicators**

### **Backend Running Successfully:**
```
Server running on port 5000
Environment: development
MongoDB Connected
```

### **Frontend Running Successfully:**
```
ready - started server on 0.0.0.0:3000
url: http://localhost:3000
```

---

## ⚠️ **Common Warnings (Safe to Ignore)**

When running `npm install`, you might see:
- ✅ `deprecated` warnings - Normal, safe to ignore
- ✅ `ExperimentalWarning` - Normal, safe to ignore
- ✅ `vulnerabilities` - For development only, safe for now

---

## 🎯 **Your Workflow**

1. **First Time Setup:**
   ```bash
   setup.bat
   ```

2. **Every Time You Code:**
   ```bash
   start-dev.bat
   ```

3. **When Done:**
   - Press `Ctrl + C` in both terminal windows
   - Or just close the windows

---

## 📞 **Need More Help?**

Read these files in order:
1. `RUN_COMMANDS.md` - How to run everything
2. `TROUBLESHOOTING.md` - Fix common problems
3. `README.md` - Full project documentation
4. `CHANGES.md` - What was modified

---

## ✅ **Current Status**

- ✅ Backend dependencies installed
- ✅ Frontend dependencies installing...
- ✅ MongoDB running
- ✅ Port 5000 free
- ✅ Backend server running

**Next:** Wait for frontend installation to complete, then run `npm run dev` in the client folder!

---

**Made with ❤️ for easy development**
