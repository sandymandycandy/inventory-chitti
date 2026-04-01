# 🚀 Deployment Guide - Bakery POS System

Complete guide to deploy your Bakery POS system to production.

---

## 📋 **Pre-Deployment Checklist**

- [ ] All features tested locally
- [ ] Database populated with initial data
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Frontend builds successfully
- [ ] Documentation updated

---

## 🔧 **Option 1: Quick Deploy (Recommended)**

### **Stack:**
- **Frontend:** Vercel (Free tier)
- **Backend:** Railway (Free tier)
- **Database:** MongoDB Atlas (Free tier)

**Total Cost:** $0/month for testing, scales as needed

---

## 🌐 **Step 1: Deploy Database (MongoDB Atlas)**

###  1.1 Create MongoDB Atlas Account
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free"
3. Create account or sign in

### 1.2 Create Cluster
1. Click "Build a Database"
2. Choose **M0 FREE** tier
3. Select region closest to you
4. Click "Create Cluster"

### 1.3 Setup Access
1. **Create Database User:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `bakery-admin`
   - Password: Generate secure password (save it!)
   - Role: Read and write to any database

2. **Whitelist IP:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Choose "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

### 1.4 Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string:
   ```
   mongodb+srv://bakery-admin:<password>@cluster0.xxxxx.mongodb.net/bakery-pos
   ```
4. Replace `<password>` with your actual password

---

## 🖥️ **Step 2: Deploy Backend (Railway)**

### 2.1 Prepare Backend
1. Create a new file `server/.env.production`:
   ```env
   MONGODB_URI=mongodb+srv://bakery-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/bakery-pos
   PORT=5000
   NODE_ENV=production
   ```

2. Update `server/package.json` - ensure you have:
   ```json
   {
     "type": "module",
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

### 2.2 Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Click "Add variables" and set:
   ```
   MONGODB_URI=<your-atlas-connection-string>
   NODE_ENV=production
   PORT=5000
   ```
6. In Settings → set:
   - **Root Directory:** `server`
   - **Start Command:** `npm start`
7. Get your backend URL: `https://your-app.up.railway.app`

###  2.3 Test Backend
```bash
curl https://your-app.up.railway.app/api/health
```
Should return: `{"status":"OK",...}`

---

## 🎨 **Step 3: Deploy Frontend (Vercel)**

### 3.1 Update API URL
Edit `src/services/api.js`:
```javascript
const API_BASE_URL = import.meta.env.PROD 
    ? 'https://your-app.up.railway.app/api'  // Your Railway URL
    : 'http://localhost:5000/api';
```

### 3.2 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `./` (project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
6. Click "Deploy"

### 3.3 Get Your URL
Your app will be live at: `https://your-app.vercel.app`

---

## 🔄 **Step 4: Populate Production Database**

SSH into Railway or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run database population
railway run node populate-test-data.js
railway run node populate-test-customers.js
```

---

## ✅ **Step 5: Verify Deployment**

1. **Frontend:** Visit `https://your-app.vercel.app`
2. **Check all pages:** Dashboard, Recipes, Inventory, Orders, Bills, Customers, Analytics
3. **Test workflows:**
   - Create a recipe
   - Add inventory
   - Process an order with customer lookup
   - View bills
   - Check analytics

---

## 🔐 **Step 6: Security Hardening**

### 6.1 Update CORS (Backend)
Edit `server/server.js`:
```javascript
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://your-app.vercel.app'
        : 'http://localhost:5173',
    credentials: true
}));
```

### 6.2 Add Rate Limiting
```bash
cd server
npm install express-rate-limit
```

Edit `server/server.js`:
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 📊 **Monitoring & Maintenance**

### Free Monitoring Tools:
1. **Railway:** Built-in metrics dashboard
2. **Vercel:** Built-in analytics
3. **MongoDB Atlas:** Performance monitoring

### Backup Strategy:
1. **MongoDB Atlas:**
   - Go to "Backup" tab
   - Enable "Cloud Backup" (free for M0)
   - Set backup frequency

2. **Manual Backup:**
   ```bash
   mongodump --uri="YOUR_MONGODB_URI" --out=./backup
   ```

---

## 🔄 **Continuous Deployment**

Both Vercel and Railway auto-deploy on git push:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push origin main
   ```
3. **Vercel** and **Railway** automatically rebuild and deploy!

---

## 💰 **Scaling & Costs**

### Free Tier Limits:
- **MongoDB Atlas M0:** 512MB storage, shared resources
- **Railway:** 500 hours/month, $5 credit
- **Vercel:** 100GB bandwidth, unlimited deployments

### When to Upgrade:
- **MongoDB:** When you hit 512MB or need better performance
- **Railway:** If you need >500 hours (hobby plan $5/month)
- **Vercel:** Enterprise features or higher bandwidth

---

## 🐛 **Troubleshooting**

### Common Issues:

**1. Frontend can't connect to backend**
- Check URL in `api.js`
- Verify Railway backend is running
- Check CORS settings

**2. Database connection fails**
- Verify MongoDB Atlas IP whitelist (0.0.0.0/0)
- Check username/password
- Ensure connection string is correct

**3. Build fails on Vercel**
- Check build logs
- Ensure all dependencies in `package.json`
- Verify `vite.config.js` is correct

---

## 📞 **Support Resources**

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **MongoDB Atlas Docs:** https://docs.atlas.mongodb.com

---

## 🎉 **Next Steps After Deployment**

1. **Custom Domain:** Add your own domain in Vercel settings
2. **SSL Certificate:** Automatic with Vercel
3. **Environment-specific configs:** Use Vercel environment variables
4. **Analytics:** Add Google Analytics or Umami
5. **Error Tracking:** Add Sentry for error monitoring

---

**Deployment Complete!** 🚀

Your Bakery POS system is now live and accessible worldwide!

**Frontend URL:** `https://your-app.vercel.app`  
**Backend API:** `https://your-app.up.railway.app/api`  
**Database:** MongoDB Atlas (Cloud)

---

**Created by:** Antigravity AI  
**Date:** January 17, 2026
