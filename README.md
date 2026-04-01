# TINS & TRAYS - Bakery Management System

> **Premium Pastries & Bakery - Complete Digital Solution**  
> *Pure Ingredients, Pure Joy - Since 2021*

---

## 📋 Table of Contents

- [Overview](#overview)
- [System Architecture](#system-architecture)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation & Setup](#installation--setup)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [User Roles & Permissions](#user-roles--permissions)
- [Production Cost Tracking](#production-cost-tracking)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

TINS & TRAYS is a comprehensive bakery management solution consisting of two integrated systems:

1. **POS System (Point of Sale)** - Internal management system for bakery operations
2. **Business Website** - Customer-facing website for online presence

### Project Structure

```
chitti/
├── bakery-pos/              # POS System
│   ├── server/              # Backend API (Node.js + Express + MongoDB)
│   └── src/                 # Frontend (React + Vite)
└── tins-trays-website/      # Business Website (React + Vite)
```

---

## 🏗️ System Architecture

### POS System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  Dashboard | Recipes | Inventory | Orders | Analytics   │
│  Bills | Customers | Categories | Purchase Bills | Users│
└────────────────────┬────────────────────────────────────┘
                     │
                     │ REST API (Axios)
                     │
┌────────────────────▼────────────────────────────────────┐
│              Backend (Express.js)                        │
│  Auth Routes | Recipe Routes | Order Routes             │
│  Bill Routes | Customer Routes | Analytics Routes       │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Mongoose ODM
                     │
┌────────────────────▼────────────────────────────────────┐
│                MongoDB Database                          │
│  Users | Recipes | Orders | Bills | Customers           │
│  Ingredients | Categories | Purchase Bills              │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Features

### 🔐 Authentication & User Management

- **JWT-based authentication** with secure token storage
- **Role-based access control** (Admin / Cashier)
- **User CRUD operations** (Admin only)
- **Password hashing** with bcryptjs
- **Secure login/logout** functionality
- Default admin credentials: `admin` / `admin123`

### 📊 Dashboard

- **Real-time sales overview**
- **Today's revenue tracking**
- **Total orders and bills**
- **Quick action buttons**
- **Recent activity feed**

### 🍰 Recipe Management

- **Create and manage recipes** with ingredients
- **Track selling price and production cost**
- **Automatic profit margin calculation** (Amount + Percentage)
- **Image upload support** for recipes
- **Category classification** (Cakes, Pastries, Breads, Cookies, Other)
- **Sales tracking** per recipe
- **Color-coded profit indicators** (Green: Profit, Red: Loss)

### 📦 Inventory Management

- **Ingredient stock tracking**
- **Unit-based quantity management** (kg, liters, pieces)
- **Supplier information**
- **Low stock alerts**
- **Reorder point notifications**
- **Stock adjustment history**

### 🛒 Orders Management

- **Create new orders** with multiple items
- **Customer assignment**
- **Order status tracking** (Pending, Completed, Cancelled)
- **Tax-free orders support**
- **Real-time order total calculation**
- **Order history and search**

### 🧾 Billing System

- **Generate bills from orders**
- **Tax calculations** (GST support)
- **Tax-free billing option**
- **Payment status tracking** (Paid, Pending, Partial)
- **Bill printing/download support**
- **Revenue reports**

### 📈 Analytics

- **Sales trends** with interactive charts (Chart.js)
- **Revenue analysis** by period
- **Product performance metrics**
- **Profit/loss reports**
- **Customer purchase patterns**
- **Category-wise sales breakdown**

### 👥 Customer Management

- **Customer database**
- **Contact information**
- **Purchase history**
- **Customer search**
- **Loyalty tracking**

### 🏷️ Category Management

- **Product categorization**
- **Category-based filtering**
- **Custom category creation**

### 🧾 Purchase Bills

- **Track ingredient purchases**
- **Supplier management**
- **Purchase history**
- **Cost tracking**

---

## 💻 Technology Stack

### POS System

#### Frontend
- **React 19.0.0** - UI library
- **Vite 7.3.1** - Build tool & dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS
- **Chart.js 4.4.7** - Data visualization
- **Axios 1.7.9** - HTTP client
- **React Router** - Navigation

#### Backend
- **Node.js** - Runtime environment
- **Express.js 4.21.2** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.9.3** - ODM
- **bcryptjs 2.4.3** - Password hashing
- **jsonwebtoken 9.0.2** - JWT authentication
- **cors 2.8.5** - Cross-origin support
- **dotenv** - Environment variables

### Business Website

#### Frontend
- **React 18.3.1** - UI library
- **Vite 6.0.3** - Build tool
- **Tailwind CSS 3.4.17** - Styling
- **Google Fonts** - Inter & Outfit typography

#### Design System
- **Color Palette**:
  - Primary (Cream/Brown): `#faf9f5` to `#4a2f18`
  - Matching logo aesthetic
  - Warm, organic, inviting tones

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (Local or Atlas)
- **npm** or **yarn**
- **Git**

### Step 1: Clone the Repository

```bash
cd C:\Users\SANDY\Desktop\chitti
```

### Step 2: Setup POS System

#### Backend Setup

```bash
cd bakery-pos/server
npm install
```

**Create `.env` file in `server/` directory:**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bakery-pos
JWT_SECRET=your-secret-key-change-in-production
```

**Start MongoDB:**

```bash
# Make sure MongoDB is running on localhost:27017
mongod
```

**Create Admin User:**

```bash
node setup-admin.js
```

This creates the default admin user:
- **Username**: `admin`
- **Password**: `admin123`

**Start Backend Server:**

```bash
node server.js
```

Backend will run on: `http://localhost:5000`

#### Frontend Setup

```bash
cd bakery-pos
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

### Step 3: Setup Business Website

```bash
cd tins-trays-website
npm install
npm run dev
```

Website will run on: `http://localhost:3000`

---

## 📖 Usage Guide

### First Time Login

1. Navigate to `http://localhost:5173`
2. Login with default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. **⚠️ IMPORTANT**: Change the default password immediately after first login

### Creating a New Recipe

1. Go to **Recipes** section
2. Click **Add Recipe** button
3. Fill in the details:
   - Recipe Name (e.g., "Chocolate Cake")
   - Category (Cakes, Pastries, Breads, etc.)
   - **Selling Price** (₹)
   - **Production Cost** (₹) - *NEW FEATURE*
   - Upload image (optional)
4. Add ingredients:
   - Select ingredient from dropdown
   - Enter quantity
   - Add more ingredients as needed
5. View **automatic profit calculation**:
   - Profit Amount = Selling Price - Production Cost
   - Profit Percentage = (Profit / Selling Price) × 100%
6. Click **Save Recipe**

### Managing Inventory

1. Go to **Inventory** section
2. Click **Add Ingredient**
3. Enter details:
   - Ingredient name
   - Quantity
   - Unit (kg, liters, pieces)
   - Reorder point
   - Supplier information
4. Monitor stock levels
5. System alerts when stock is low

### Creating Orders

1. Go to **Orders** section
2. Click **New Order**
3. Select customer (or add new)
4. Add items:
   - Select recipe
   - Enter quantity
   - Price auto-calculated
5. Choose payment status
6. Enable/disable tax
7. Submit order

### Generating Bills

1. Go to **Bills** section
2. Click **New Bill**
3. Link to existing order or create new
4. Review totals (Subtotal + Tax)
5. Mark payment status
6. Print/Download bill

### Viewing Analytics

1. Go to **Analytics** section
2. View charts:
   - Sales trends over time
   - Revenue breakdown
   - Product performance
   - Profit/loss analysis
3. Filter by date range
4. Export reports

### User Management (Admin Only)

1. Go to **User Management**
2. View all users
3. Add new user:
   - Username
   - Password
   - Role (Admin/Cashier)
   - Active status
4. Edit existing users
5. Change passwords
6. Deactivate users

---

## 🔌 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST `/auth/login`
Login user and get JWT token

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "username": "admin",
    "role": "admin"
  }
}
```

#### POST `/auth/register`
Register new user (Admin only)

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "username": "cashier1",
  "password": "password123",
  "role": "cashier"
}
```

#### GET `/auth/me`
Get current user info

**Headers:**
```
Authorization: Bearer <token>
```

#### GET `/auth/users`
Get all users (Admin only)

#### PUT `/auth/users/:id`
Update user (Admin only)

#### DELETE `/auth/users/:id`
Delete user (Admin only)

#### PUT `/auth/change-password/:id`
Change user password

### Recipe Endpoints

#### GET `/recipes`
Get all recipes

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Chocolate Cake",
    "category": "Cakes",
    "sellingPrice": 500,
    "productionCost": 250,
    "imageUrl": "data:image/jpeg;base64,...",
    "ingredients": [...],
    "totalSold": 50,
    "isActive": true
  }
]
```

#### POST `/recipes`
Create new recipe

**Request:**
```json
{
  "name": "Chocolate Cake",
  "category": "Cakes",
  "sellingPrice": 500,
  "productionCost": 250,
  "imageUrl": "...",
  "ingredients": [
    {
      "ingredient": "ingredient_id",
      "quantity": 2
    }
  ]
}
```

#### PUT `/recipes/:id`
Update recipe

#### DELETE `/recipes/:id`
Delete recipe

### Order Endpoints

#### GET `/orders`
Get all orders

#### POST `/orders`
Create new order

#### PUT `/orders/:id`
Update order

#### DELETE `/orders/:id`
Delete order

### Bill Endpoints

#### GET `/bills`
Get all bills

#### POST `/bills`
Create new bill

#### PUT `/bills/:id`
Update bill

#### DELETE `/bills/:id`
Delete bill

### Analytics Endpoints

#### GET `/analytics/sales-trend`
Get sales trend data

#### GET `/analytics/revenue`
Get revenue statistics

#### GET `/analytics/profit-analysis`
Get profit/loss analysis

### Customer Endpoints

#### GET `/customers`
Get all customers

#### POST `/customers`
Create new customer

#### PUT `/customers/:id`
Update customer

#### DELETE `/customers/:id`
Delete customer

### Ingredient Endpoints

#### GET `/ingredients`
Get all ingredients

#### POST `/ingredients`
Create new ingredient

#### PUT `/ingredients/:id`
Update ingredient stock

#### DELETE `/ingredients/:id`
Delete ingredient

### Category Endpoints

#### GET `/categories`
Get all categories

#### POST `/categories`
Create new category

### Purchase Bill Endpoints

#### GET `/purchase-bills`
Get all purchase bills

#### POST `/purchase-bills`
Create new purchase bill

---

## 👥 User Roles & Permissions

### Admin Role

**Full Access:**
- ✅ All CRUD operations
- ✅ User management
- ✅ View analytics
- ✅ Manage recipes, inventory, orders
- ✅ Access all reports
- ✅ System configuration

### Cashier Role

**Limited Access:**
- ✅ Create/view orders
- ✅ Generate bills
- ✅ View recipes
- ✅ View customers
- ❌ Cannot manage users
- ❌ Cannot delete records
- ❌ Limited analytics access

---

## 💰 Production Cost Tracking

### New Feature: Profit Margin Analysis

**Recipe Card Display:**
- **Selling Price**: Main price display
- **Production Cost**: Actual cost to make
- **Profit Amount**: Selling Price - Production Cost
- **Profit Percentage**: (Profit / Selling Price) × 100%

**Visual Indicators:**
- 🟢 **Green**: Positive profit
- 🔴 **Red**: Negative profit/loss

**Live Calculation:**
As you enter prices in the form, profit automatically calculates in real-time.

**Example:**
```
Selling Price: ₹500
Production Cost: ₹250
---
Profit: ₹250 (50%)
```

**Benefits:**
- Track product profitability
- Make informed pricing decisions
- Identify loss-making products
- Optimize production costs
- Improve profit margins

---

## 🎨 Design System

### POS System Theme

**Light Blue Professional Theme**

- **Primary Blue**: `#0369a1` to `#0c4a6e` (Gradient)
- **Sky Accents**: `#0ea5e9`
- **White Cards**: Clean, elevated design
- **Refined Shadows**: Professional depth
- **Typography**: Inter (body), Outfit (headings)

### Business Website Theme

**Cream & Brown - Logo Matching**

- **Cream Background**: `#faf9f5` to `#e8e6d8`
- **Brown Accents**: `#6b4423` (primary), `#4a2f18` (dark)
- **Warm Palette**: Organic, inviting feel
- **Typography**: Inter, Outfit (Google Fonts)

**Logo Design:**
- Vintage botanical illustration
- "PURE INGREDIENTS - PURE JOY" circular text
- "TINS & TRAYS" script font
- "ESTD 2021" baseline

---

## 📱 Business Website Sections

### 1. Header
- Sticky navigation
- Smooth scroll to sections
- Mobile responsive menu
- "Order Now" CTA button

### 2. Hero Section
- Large welcome banner
- Company tagline
- Stats display:
  - 10+ Years Experience
  - 500+ Happy Customers
  - 50+ Unique Products
- Dual CTAs (View Menu, Contact)
- Floating feature cards

### 3. About Section
- Company mission
- Three key features:
  - 🌾 Premium Ingredients
  - 👨‍🍳 Expert Bakers
  - ⏰ Fresh Daily
- Mission statement card

### 4. Products Section
- 8 Product categories:
  - 🥐 Croissants
  - 🍰 Custom Cakes
  - 🥖 Artisan Breads
  - 🧁 Cupcakes
  - 🍪 Cookies
  - 🥧 Pies & Tarts
  - 🍩 Donuts
  - 🎂 Pastries
- Price ranges
- Order buttons
- Custom order CTA

### 5. Gallery Section
- Visual showcase grid
- Gradient product cards
- Instagram integration
- Social media links

### 6. Contact Section
- Contact form with WhatsApp integration
- Business information:
  - 📍 Address
  - 📞 Phone numbers
  - ⏰ Opening hours
  - 📧 Email addresses
- Interactive form

### 7. Footer
- Company branding
- Quick links navigation
- Social media icons
- Copyright information
- Contact details

---

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error

**Error:** `MongooseServerSelectionError`

**Solution:**
```bash
# Start MongoDB service
mongod

# Or check if running
mongo --version
```

#### 2. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process on port 5000
netstat -ano | findstr :5000

# Kill process
taskkill /PID <PID> /F

# Or change port in .env file
PORT=5001
```

#### 3. Authentication Failed

**Error:** `401 Unauthorized`

**Solution:**
- Clear browser localStorage
- Re-login with credentials
- Check JWT_SECRET in .env
- Verify token expiration

#### 4. Tailwind Classes Not Working

**Error:** CSS classes not applying

**Solution:**
```bash
# Rebuild Tailwind
npm run build

# Clear cache and restart
rm -rf node_modules/.vite
npm run dev
```

#### 5. CORS Errors

**Error:** `CORS policy blocked`

**Solution:**
Check `server.js` has CORS enabled:
```javascript
app.use(cors());
```

---

## 🔄 Running All Systems

### Quick Start Commands

**Terminal 1 - Backend:**
```bash
cd bakery-pos/server
node server.js
```

**Terminal 2 - POS Frontend:**
```bash
cd bakery-pos
npm run dev
```

**Terminal 3 - Business Website:**
```bash
cd tins-trays-website
npm run dev
```

### Access Points

- **POS System**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Business Website**: http://localhost:3000

---

## 📝 Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bakery-pos

# Authentication
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  username: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['admin', 'cashier'], default: 'cashier'),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Recipes Collection
```javascript
{
  name: String (required),
  category: String (enum, required),
  sellingPrice: Number (required, min: 0),
  productionCost: Number (default: 0, min: 0),
  imageUrl: String,
  ingredients: [{
    ingredient: ObjectId (ref: 'Ingredient'),
    quantity: Number (required, min: 0)
  }],
  isActive: Boolean (default: true),
  totalSold: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: 'Customer'),
  items: [{
    recipe: ObjectId (ref: 'Recipe'),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  tax: Number,
  isTaxFree: Boolean (default: false),
  status: String (enum: ['pending', 'completed', 'cancelled']),
  paymentStatus: String (enum: ['paid', 'pending', 'partial']),
  createdAt: Date,
  updatedAt: Date
}
```

### Bills Collection
```javascript
{
  billNumber: String (unique),
  order: ObjectId (ref: 'Order'),
  customer: ObjectId (ref: 'Customer'),
  items: Array,
  subtotal: Number,
  tax: Number,
  totalAmount: Number,
  paymentStatus: String,
  createdAt: Date
}
```

### Customers Collection
```javascript
{
  name: String (required),
  phone: String,
  email: String,
  address: String,
  totalPurchases: Number (default: 0),
  createdAt: Date
}
```

### Ingredients Collection
```javascript
{
  name: String (required, unique),
  quantity: Number (default: 0),
  unit: String (required),
  reorderPoint: Number,
  supplier: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Categories Collection
```javascript
{
  name: String (required, unique),
  description: String,
  createdAt: Date
}
```

### PurchaseBills Collection
```javascript
{
  billNumber: String (unique),
  supplier: String,
  items: [{
    ingredient: ObjectId (ref: 'Ingredient'),
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  purchaseDate: Date,
  createdAt: Date
}
```

---

## 🎯 Future Enhancements

### Planned Features

- [ ] Email notifications for orders
- [ ] SMS alerts for customers
- [ ] Online ordering integration
- [ ] Payment gateway integration
- [ ] QR code for bills
- [ ] Recipe cost auto-calculation from ingredients
- [ ] Multi-location support
- [ ] Employee management
- [ ] Shift management
- [ ] Advanced reporting
- [ ] Mobile app (React Native)
- [ ] Barcode scanning
- [ ] Printer integration
- [ ] Inventory auto-deduction on sales
- [ ] Customer loyalty program
- [ ] Promotional campaigns
- [ ] WhatsApp Business API integration

---

## 📄 License

This project is proprietary software for TINS & TRAYS bakery.

---

## 👨‍💻 Development

### Project Created
**Date**: January 2026

### Version
**Current**: 1.0.0

### Maintained By
TINS & TRAYS Development Team

---

## 📞 Support

For technical support or inquiries:

- **Email**: info@tinsandtrays.com
- **Phone**: +91 98765 43210
- **Address**: 123 Bakery Street, Mumbai, Maharashtra 400001

---

## 🙏 Acknowledgments

- React.js team
- MongoDB team
- Tailwind CSS
- Chart.js
- All open-source contributors

---

**TINS & TRAYS** - *Where Every Bite Tells a Story* 🥐

**Est. 2021** | **Pure Ingredients, Pure Joy**
