# 🔧 Quick Fix Guide

## ✅ **Problem: Port 5000 Already in Use**

### **Solution 1: Use the Kill Script (Easiest)**
Double-click: `kill-port-5000.bat`

### **Solution 2: Manual Command**
```bash
# Find the process
netstat -ano | findstr :5000

# Kill it (replace PID with the number you see)
taskkill /PID <PID_NUMBER> /F
```

### **Solution 3: Use Updated Start Script**
The `start-dev.bat` now automatically kills processes on ports 5000 and 3000 before starting!

Just run:
```bash
start-dev.bat
```

---

## ✅ **Problem: Port 3000 Already in Use**

### **Solution 1: Use the Kill Script**
Double-click: `kill-port-3000.bat`

### **Solution 2: Manual Command**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

---

## ✅ **Problem: MongoDB Not Running**

### **Solution 1: Start as Service**
```bash
net start MongoDB
```

### **Solution 2: Start Manually**
```bash
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod
```

### **Solution 3: Check if Running**
```bash
net start | findstr MongoDB
```

---

## ✅ **Problem: npm install Failed**

### **Solution: Clear Cache and Reinstall**
```bash
# For server
cd server
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install

# For client
cd ..\client
npm cache clean --force
rmdir /s /q node_modules
del package-lock.json
npm install
```

---

## ✅ **Problem: Server Crashes Immediately**

### **Check 1: MongoDB Connection**
Make sure MongoDB is running:
```bash
net start MongoDB
```

### **Check 2: Environment Variables**
Open `server\.env` and verify:
```env
MONGO_URI=mongodb://127.0.0.1:27017/ecommerce
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### **Check 3: View Server Logs**
The error will be shown in the terminal. Common errors:
- `ECONNREFUSED` → MongoDB not running
- `EADDRINUSE` → Port already in use
- `MODULE_NOT_FOUND` → Run `npm install`

---

## ✅ **Problem: Frontend Shows Error**

### **Solution 1: Check Backend is Running**
Visit: http://localhost:5000/health

Should show:
```json
{"status":"OK","message":"Server is running"}
```

### **Solution 2: Clear Next.js Cache**
```bash
cd client
rmdir /s /q .next
npm run dev
```

---

## ✅ **Problem: Can't Access http://localhost:3000**

### **Check 1: Frontend Server Running?**
Look for this in the terminal:
```
ready - started server on 0.0.0.0:3000
```

### **Check 2: Try Different Browser**
Sometimes browser cache causes issues. Try:
- Chrome Incognito
- Different browser
- Clear browser cache (Ctrl + Shift + Delete)

---

## 🛠️ **Utility Scripts Created**

| Script | Purpose |
|--------|---------|
| `setup.bat` | Install all dependencies |
| `start-dev.bat` | Start both servers (auto-kills old processes) |
| `kill-port-5000.bat` | Kill process on port 5000 |
| `kill-port-3000.bat` | Kill process on port 3000 |

---

## 📋 **Common Commands**

### **Check What's Running on a Port**
```bash
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

### **Kill a Process by PID**
```bash
taskkill /PID <PID_NUMBER> /F
```

### **Kill All Node Processes (Nuclear Option)**
```bash
taskkill /IM node.exe /F
```

### **Restart Everything Fresh**
```bash
# Kill all node processes
taskkill /IM node.exe /F

# Start MongoDB
net start MongoDB

# Start servers
start-dev.bat
```

---

## 🚨 **Emergency Reset**

If nothing works, do this:

```bash
# 1. Kill all Node processes
taskkill /IM node.exe /F

# 2. Navigate to project
cd c:\users\samay\OneDrive\Desktop\ecommerce

# 3. Clean server
cd server
rmdir /s /q node_modules
del package-lock.json
npm install

# 4. Clean client
cd ..\client
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json
npm install

# 5. Start fresh
cd ..
start-dev.bat
```

---

## ✅ **Your Issue is Fixed!**

The port 5000 error has been resolved. Your server should now be running.

**Next time**, just use:
```bash
start-dev.bat
```

It will automatically clean up ports before starting! 🎉
