# 🍰 Bakery POS Management System

A comprehensive, production-ready Point of Sale (POS) system designed specifically for bakeries, featuring inventory management, recipe costing, order processing, customer management, and analytics. Built with **React 19**, **Node.js/Express**, and **MongoDB**.

![Bakery POS](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0+-brightgreen)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-orange)

---

## 🌟 Features

### 📊 **Dashboard & Analytics**
- Real-time revenue, orders, recipes, and inventory statistics
- Recent orders list with customer details
- Low stock alerts with visual indicators
- Sales trends and profit analysis
- Date range filtering (Today, Week, Month, Year, Custom)
- Modern card-based layout with gradient themes

### 📖 **Recipe Management**
- Create, edit, and delete recipes with unlimited ingredients
- **Automatic production cost calculation** based on ingredient prices
- **Auto-update costs** when material prices change
- **Unit conversion system** (ML↔L, G↔KG) with smart conversions
- Profit margin tracking and visibility
- Dynamic category organization
- Recipe cards showing ingredients, costs, and pricing
- Selling price and profit percentage calculation

### 📦 **Inventory Management (Ingredients)**
- Complete CRUD operations for ingredients
- Real-time stock tracking with unit flexibility
- **Duplicate prevention** (case-insensitive validation)
- Cost per unit management with purchase history
- Minimum stock alert thresholds
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- Total inventory value calculations
- Support for multiple units: KG, G, L, ML, Pieces, Dozen
- Last updated timestamp tracking

### 🛒 **Order Processing (POS Interface)**
- Professional shopping cart interface
- Recipe selection with category filtering
- Real-time pricing and stock availability
- Quantity adjustment with +/- buttons
- Multiple payment methods (Cash, Card, UPI)
- Customer selection/creation
- Live subtotal, tax, and total calculations
- **Automatic stock deduction** when order is placed
- **Automatic bill generation** with unique bill numbers
- Order status tracking (Pending, Completed, Cancelled)

### 💰 **Purchase Bills Management**
- Record material purchases from vendors
- **Flexible unit selection** (buy in any unit: KG, L, G, ML, etc.)
- **Auto-update ingredient costs** from purchase bills
- **Auto-recalculate all recipe costs** when ingredients update
- Bill number tracking and vendor management
- Purchase date recording and notes
- Stock update functionality from bills
- Total amount calculation

### 👥 **Customer Management**
- Customer database with contact information
- Search functionality for quick customer lookup
- Order history tracking per customer
- Total orders and spending metrics
- Phone number validation (unique)
- Address and email management

### 🏷️ **Category Management**
- Custom categories with icons and colors
- Dynamic category creation
- Icon library integration (Lucide icons)
- Color customization for visual organization
- Used across recipes and orders

### 🧾 **Bills & Invoices**
- View all generated bills in searchable table
- Filter by date range (Today, Last 7 Days, Last 30 Days, All Time)
- Search by bill number or customer name
- Detailed invoice modal with itemized breakdown
- **Professional print functionality** with formatted invoice template
- Bill numbers (BILL-YYYYMMDD-XXXX format)
- Payment method tracking
- Tax calculation and display

### 📈 **Analytics & Reports**
- **Revenue Trend Chart** - Last 7 days performance visualization
- **Top Selling Products** - Bar chart showing bestsellers
- **Sales by Category** - Distribution analysis
- **Product Performance Table** - Detailed sales metrics per recipe
- Key metrics cards (Total Revenue, Orders, Customers, Profit Margins)
- Date range filtering for custom reports
- Real-time data updates

### 🎯 **Advanced Features**
- **Automatic stock deduction** from inventory when orders are created
- **Real-time recipe cost calculation** based on current ingredient prices
- **Auto-update system**: Recipe costs recalculate when ingredient prices change
- **Unit conversion intelligence**: Buy in KG, use in G (automatic conversions)
- **Stock availability checking** before order placement
- **Sequential numbering** for orders and bills
- **Low stock notifications** with configurable thresholds
- **Duplicate prevention** for ingredients (case-insensitive)
- **Mobile responsive design** with touch-optimized UI
- **Network access** for multi-device usage

### 🎨 **UI/UX Features**
- **Collapsible sidebar** (288px ↔ 80px) with smooth transitions
- **Modern gradient themes** (Sky blue: #0369a1 → #0c4a6e)
- **Glass morphism** design elements
- **Custom logo integration** (Tins & Trays branding)
- **Responsive layouts** optimized for desktop, tablet, and mobile
- **Touch targets** minimum 48px for mobile usability
- **Active state animations** for tactile feedback
- **Lucide React icons** throughout the interface
- **Loading states** and error handling

---

## 🛠️ **Technology Stack**

### Frontend
- **Framework:** React 19.0.0 with Vite 7.3.1
- **Styling:** Tailwind CSS 3.4.17 (modern utility-first framework)
- **Charts:** Chart.js for analytics visualization
- **HTTP Client:** Axios with interceptors
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect)
- **Build Tool:** Vite (fast HMR, optimized builds)

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB 5.0+ with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Security:** bcrypt for password hashing
- **API Architecture:** RESTful with async/await
- **Network:** Configured for 0.0.0.0 (all interfaces)

### Development Tools
- **Package Manager:** npm
- **Code Style:** ES6+ with modern JavaScript
- **Module System:** ES Modules (import/export)

---

## 📁 **Project Structure**

```
bakery-pos/
├── public/
│   └── logo.png                  # Bakery logo (Tins & Trays)
│
├── src/                          # React frontend
│   ├── components/
│   │   ├── Dashboard.jsx         # Main dashboard with stats
│   │   ├── Recipes.jsx           # Recipe management with cost calc
│   │   ├── Inventory.jsx         # Ingredient stock management
│   │   ├── Orders.jsx            # POS order interface
│   │   ├── Bills.jsx             # Bills & invoices viewer
│   │   ├── PurchaseBills.jsx     # Purchase bill entry
│   │   ├── Customers.jsx         # Customer database
│   │   ├── Categories.jsx        # Category management
│   │   ├── Analytics.jsx         # Charts & reports
│   │   └── Sidebar.jsx           # Collapsible navigation
│   ├── services/
│   │   └── api.js                # Axios API service layer
│   ├── App.jsx                   # Main app with routing
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Tailwind + custom styles
│
├── server/                       # Node.js backend
│   ├── models/
│   │   ├── Ingredient.js         # Ingredient schema (with duplicate prevention)
│   │   ├── Recipe.js             # Recipe schema (with auto-cost calc)
│   │   ├── Order.js              # Order schema
│   │   ├── Bill.js               # Bill schema
│   │   ├── PurchaseBill.js       # Purchase bill schema
│   │   ├── Customer.js           # Customer schema
│   │   └── Category.js           # Category schema
│   ├── routes/
│   │   ├── ingredients.js        # Ingredient CRUD endpoints
│   │   ├── recipes.js            # Recipe CRUD endpoints
│   │   ├── orders.js             # Order processing endpoints
│   │   ├── bills.js              # Bill management endpoints
│   │   ├── purchaseBills.js      # Purchase bill endpoints (with auto-recalc)
│   │   ├── customers.js          # Customer CRUD endpoints
│   │   ├── categories.js         # Category CRUD endpoints
│   │   └── analytics.js          # Analytics data endpoints
│   ├── server.js                 # Express server (listens on 0.0.0.0:5000)
│   ├── create-admin.js           # Admin user creation script
│   ├── clear-database.js         # Database reset utility
│   ├── seed-categories.js        # Category seeding script
│   ├── populate-test-data.js     # Sample data generator
│   ├── populate-test-customers.js # Customer data seeder
│   ├── create-orders.js          # Order data seeder
│   ├── add-*-ingredients.js      # Various ingredient import scripts
│   └── remove-duplicate-milk.js  # Duplicate cleanup utility
│
├── tailwind.config.js            # Tailwind configuration
├── vite.config.js                # Vite build configuration (network access enabled)
├── postcss.config.js             # PostCSS configuration
├── eslint.config.js              # ESLint configuration
├── package.json                  # Frontend dependencies
└── README.md                     # This comprehensive documentation
```

---

## 🚀 **Installation & Setup**

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **MongoDB** 5.0+ ([Local](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas))
- **npm** or **yarn**

### 1. Clone & Install Dependencies

```bash
# Clone or extract the repository
cd bakery-pos

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Configure Environment (Optional)

The system uses default configurations. For custom settings, create `server/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/bakery-pos

# Server
PORT=5000
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_here

# MongoDB Atlas (cloud) example:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakery-pos
```

### 3. Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod

# Or use MongoDB Compass / Atlas cloud
```

### 4. Initialize Database

```bash
cd server

# Create admin user (username: admin, password: admin123)
node create-admin.js

# Optional: Seed test data
node seed-categories.js
node populate-test-data.js
node populate-test-customers.js
```

### 5. Start the Application

**Terminal 1 - Backend Server:**
```bash
cd server
node server.js
# OR for development with auto-restart:
# npm run dev (if nodemon is installed)
```

Output:
```
🔗 MongoDB Connected Successfully!
🚀 Server running on:
   - Local:   http://localhost:5000
   - Network: http://192.168.29.176:5000
```

**Terminal 2 - Frontend (new terminal):**
```bash
# From root directory
npm run dev
```

Output:
```
  VITE ready in 432 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.29.176:5173/
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Login:** admin / admin123

---

## 📱 **Mobile & Network Access**

The system is configured for multi-device access on the same network:

### Setup
1. **Start both servers** (backend and frontend)
2. **Find your network IP** from server output (e.g., 192.168.29.176)
3. **Access from any device** on the same network:
   - Mobile: `http://192.168.29.176:5173`
   - Tablet: `http://192.168.29.176:5173`
   - Another PC: `http://192.168.29.176:5173`

### Technical Details
- **Vite Configuration:** `host: true` in [vite.config.js](vite.config.js)
- **Backend:** Listens on `0.0.0.0:5000` (all network interfaces)
- **Dynamic API URL:** Automatically uses network IP when accessed remotely
- **CORS:** Configured to accept requests from network devices

### Mobile Optimizations
- **Touch Targets:** 48px minimum for all buttons and inputs
- **Font Size:** 16px to prevent iOS auto-zoom on input focus
- **Responsive Modals:** Sticky headers/footers, scrollable content
- **Grid Layouts:** Single column on mobile, multi-column on desktop
- **Active States:** Scale animations for tactile feedback

### Firewall Configuration
If network access doesn't work:

**Windows:**
```powershell
# Allow port 5173 (frontend)
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173

# Allow port 5000 (backend)
netsh advfirewall firewall add rule name="Node Backend" dir=in action=allow protocol=TCP localport=5000
```

**macOS/Linux:**
```bash
# Check firewall status
sudo ufw status

# Allow ports
sudo ufw allow 5173
sudo ufw allow 5000
```

---

## 📡 **API Endpoints**

### Authentication
```http
POST /api/auth/login          # User login
POST /api/auth/register       # User registration
```

### Ingredients
```http
GET    /api/ingredients                 # Get all ingredients
POST   /api/ingredients                 # Create ingredient
PUT    /api/ingredients/:id             # Update ingredient
PATCH  /api/ingredients/:id/stock       # Update stock
DELETE /api/ingredients/:id             # Delete ingredient
GET    /api/ingredients/status/low-stock # Get low stock items
```

### Recipes
```http
GET    /api/recipes                     # Get all recipes
POST   /api/recipes                     # Create recipe (auto-calculates cost)
PUT    /api/recipes/:id                 # Update recipe
DELETE /api/recipes/:id                 # Delete recipe
GET    /api/recipes/:id/can-make        # Check if enough stock
GET    /api/recipes/analytics/top-selling # Top selling recipes
```

### Orders
```http
GET    /api/orders                      # Get all orders
POST   /api/orders                      # Create order (deducts stock, creates bill)
PUT    /api/orders/:id                  # Update order
PUT    /api/orders/:id/status           # Update order status
DELETE /api/orders/:id                  # Delete order
GET    /api/orders/customer/:customerId # Get customer orders
```

### Bills
```http
GET    /api/bills                       # Get all bills
GET    /api/bills/:id                   # Get bill by ID
GET    /api/bills/search?query=...      # Search bills
GET    /api/bills/filter?startDate=...&endDate=... # Filter by date
DELETE /api/bills/:id                   # Delete bill
```

### Purchase Bills
```http
GET    /api/purchaseBills               # Get all purchase bills
POST   /api/purchaseBills               # Create purchase bill
GET    /api/purchaseBills/:id           # Get purchase bill by ID
PUT    /api/purchaseBills/:id/stock     # Update stock from bill (auto-recalcs recipes)
DELETE /api/purchaseBills/:id           # Delete purchase bill
```

### Customers
```http
GET    /api/customers                   # Get all customers
POST   /api/customers                   # Create customer
PUT    /api/customers/:id               # Update customer
DELETE /api/customers/:id               # Delete customer
GET    /api/customers/search?query=...  # Search customers
```

### Categories
```http
GET    /api/categories                  # Get all categories
POST   /api/categories                  # Create category
PUT    /api/categories/:id              # Update category
DELETE /api/categories/:id              # Delete category
```

### Analytics
```http
GET    /api/analytics/summary           # Overall statistics
GET    /api/analytics/sales?startDate=...&endDate=... # Sales data
GET    /api/analytics/revenue-trend     # Revenue trend chart data
GET    /api/analytics/top-products      # Top selling products
GET    /api/analytics/category-sales    # Sales by category
```

---

## 💾 **Database Schema**

### Ingredients Collection
```javascript
{
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    set: (value) => value.trim().toLowerCase() // Case-insensitive storage
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'g', 'L', 'ml', 'pieces', 'dozen']
  },
  currentStock: { type: Number, default: 0 },
  minStockAlert: { type: Number, default: 10 },
  costPerUnit: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
}

// Pre-save hook: Prevents case-insensitive duplicates
// Index: { name: 1 } unique
```

### Recipes Collection
```javascript
{
  name: { type: String, required: true },
  category: { type: String, trim: true }, // Dynamic categories
  size: { type: String },
  ingredients: [{
    ingredient: { type: ObjectId, ref: 'Ingredient' },
    quantity: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['kg', 'g', 'L', 'ml', 'pieces', 'dozen']
    }
  }],
  productionCost: { type: Number, default: 0 }, // Auto-calculated
  sellingPrice: { type: Number, required: true },
  profitMargin: { type: Number } // Calculated: (sellingPrice - productionCost) / sellingPrice * 100
}

// Pre-save hook: Calculates productionCost with unit conversions
// Auto-updates when ingredient costs change
```

### Orders Collection
```javascript
{
  customer: { type: ObjectId, ref: 'Customer' },
  items: [{
    recipe: { type: ObjectId, ref: 'Recipe' },
    recipeName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi'],
    default: 'cash'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'completed'
  },
  orderDate: { type: Date, default: Date.now }
}

// Post-save hook: Auto-deducts stock, creates bill
```

### Purchase Bills Collection
```javascript
{
  billNumber: { type: String, required: true },
  vendor: { type: String, required: true },
  items: [{
    ingredient: { type: ObjectId, ref: 'Ingredient' },
    quantity: { type: Number, required: true },
    unit: { type: String }, // Flexible: can be any unit
    rate: { type: Number, required: true },
    amount: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  purchaseDate: { type: Date, default: Date.now },
  notes: { type: String }
}

// Stock update endpoint: Updates ingredient.costPerUnit
// Triggers recalculateRecipeCosts() to update all affected recipes
```

### Customers Collection
```javascript
{
  name: { type: String, required: true },
  phone: { type: String, unique: true },
  email: { type: String },
  address: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### Categories Collection
```javascript
{
  name: { type: String, required: true, unique: true },
  icon: { type: String }, // Lucide icon name
  color: { type: String }, // Hex color code
  description: { type: String }
}
```

### Bills Collection
```javascript
{
  billNumber: { type: String, unique: true }, // Format: BILL-YYYYMMDD-XXXX
  order: { type: ObjectId, ref: 'Order' },
  customer: { type: ObjectId, ref: 'Customer' },
  items: [{
    recipeName: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 }, // 5% GST
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String },
  billDate: { type: Date, default: Date.now }
}
```

---

## 🔧 **Utility Scripts**

All scripts are in the `server/` directory:

### Database Management
```bash
# Clear entire database (all collections)
node clear-database.js

# Create admin user (admin/admin123)
node create-admin.js
```

### Data Seeding
```bash
# Seed categories (Brownie, Cakes, Cookies, etc.)
node seed-categories.js

# Add Jaggery Base brownie ingredients (10 items)
node add-jaggery-base-ingredients.js

# Add bread recipe ingredients (5 items)
node add-bread-ingredients.js

# Add cake filling ingredients from PDF (20 items)
node add-all-ingredients.js
node add-pdf-ingredients.js

# Add biscuit ingredients from PDF (36 items)
node add-biscuit-ingredients.js

# Add specific recipe ingredients from images
node add-image-ingredients.js

# Populate test customers (10 customers)
node populate-test-customers.js

# Populate complete test data (ingredients, recipes, orders, bills)
node populate-test-data.js

# Create sample orders
node create-orders.js
```

### Data Cleanup
```bash
# Remove duplicate ingredients (e.g., duplicate milk entries)
node remove-duplicate-milk.js
```

### PDF Extraction (Python)
```bash
# Extract ingredients from PDF files
python extract_pdf_ingredients.py "path/to/recipe.pdf"
```

---

## 📊 **Key Features Explained**

### 1. Automatic Production Cost Calculation

When ingredient prices change, all related recipe costs update automatically:

**Flow:**
1. Purchase bill created with new ingredient cost
2. `purchaseBills.js` updates `ingredient.costPerUnit`
3. `recalculateRecipeCosts()` function triggered
4. Finds all recipes using that ingredient
5. Recalculates production cost for each recipe
6. Saves updated costs

**Example:**
```javascript
// Recipe: Brownie 6x6
// Ingredient: Milk stored as "L" (Liter) at ₹70/L
// Recipe uses: 125 ML

// Conversion:
125 ML × 0.001 = 0.125 L

// Cost calculation:
0.125 L × ₹70/L = ₹8.75

// Total recipe cost = sum of all ingredient costs
// Production cost auto-updates when milk price changes
```

### 2. Unit Conversion System

Smart unit conversion between related units:

**Supported Conversions:**
- **Volume:** ML ↔ L (1000 ML = 1 L)
- **Weight:** G ↔ KG (1000 G = 1 KG)
- **Count:** Pieces, Dozen (no conversion)

**Implementation:**
```javascript
function convertToBaseUnit(quantity, fromUnit, baseUnit) {
  // ML to L
  if (fromUnit === 'ml' && baseUnit === 'L') {
    return quantity * 0.001;
  }
  // G to KG
  if (fromUnit === 'g' && baseUnit === 'kg') {
    return quantity * 0.001;
  }
  // L to ML
  if (fromUnit === 'L' && baseUnit === 'ml') {
    return quantity * 1000;
  }
  // KG to G
  if (fromUnit === 'kg' && baseUnit === 'g') {
    return quantity * 1000;
  }
  // Same unit
  return quantity;
}
```

**User Experience:**
- **Purchase Bills:** Buy in any unit (1 KG, 500 G, 2 L, etc.)
- **Recipes:** Unit selector shows only compatible units
- **Auto-selection:** When ingredient selected, default unit auto-fills
- **Cost Accuracy:** Conversions ensure precise cost calculations

### 3. Duplicate Prevention

Case-insensitive ingredient validation:

**Ingredient Model:**
```javascript
// Pre-save hook
ingredientSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('name')) {
    const existing = await this.constructor.findOne({
      name: this.name.toLowerCase(),
      _id: { $ne: this._id }
    });
    
    if (existing) {
      throw new Error('Ingredient already exists');
    }
  }
  next();
});

// Name setter (auto-lowercase)
name: {
  type: String,
  set: (value) => value.trim().toLowerCase()
}
```

**Result:**
- "MILK", "Milk", "milk" → All treated as same ingredient
- Clear error message: "Ingredient already exists"
- Works for both create and update operations

### 4. Stock Deduction Flow

Automatic inventory management:

**Order Creation:**
1. User creates order with recipes and quantities
2. System validates stock availability
3. Order saved to database
4. **Post-save hook triggered:**
   ```javascript
   orderSchema.post('save', async function(doc) {
     // For each recipe in order
     for (const item of doc.items) {
       const recipe = await Recipe.findById(item.recipe).populate('ingredients.ingredient');
       
       // For each ingredient in recipe
       for (const ing of recipe.ingredients) {
         const convertedQty = convertToBaseUnit(ing.quantity, ing.unit, ing.ingredient.unit);
         const totalNeeded = convertedQty * item.quantity;
         
         // Deduct from stock
         await Ingredient.findByIdAndUpdate(ing.ingredient._id, {
           $inc: { currentStock: -totalNeeded }
         });
       }
     }
   });
   ```
5. Bill automatically generated with unique bill number

### 5. Mobile Responsiveness

Optimizations for touch devices:

**CSS Enhancements:**
```css
/* Touch targets */
button, input, select {
  min-height: 48px; /* Apple HIG recommendation */
}

/* Prevent iOS zoom */
input, select, textarea {
  font-size: 16px; /* iOS won't zoom if >= 16px */
}

/* Remove tap highlight */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Sticky modal headers */
.modal-header {
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Responsive grids */
.grid {
  grid-template-columns: 1fr; /* Mobile */
}

@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* Desktop */
  }
}
```

**React Components:**
```jsx
// Active state feedback
<button className="active:scale-[0.98] active:bg-gray-200">
  Tap Me
</button>

// Responsive modal
<div className="max-h-[95vh] overflow-hidden flex flex-col">
  <div className="sticky top-0 bg-white">Header</div>
  <div className="flex-1 overflow-y-auto">Content</div>
  <div className="sticky bottom-0 bg-white">Footer</div>
</div>
```

---

## 🎨 **UI/UX Design System**

### Color Palette
```css
/* Primary (Sky Blue) */
--sky-700: #0369a1;
--sky-800: #075985;
--sky-900: #0c4a6e;

/* Gradients */
background: linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%);

/* Status Colors */
--success: #10b981; /* Green */
--warning: #f59e0b; /* Amber */
--danger: #ef4444;  /* Red */
--info: #3b82f6;    /* Blue */
```

### Typography
```css
/* Headings */
h1: text-3xl font-bold (30px)
h2: text-2xl font-semibold (24px)
h3: text-xl font-semibold (20px)

/* Body */
body: text-base (16px)
small: text-sm (14px)
tiny: text-xs (12px)
```

### Spacing
```css
/* Tailwind Scale */
sm: 0.5rem (8px)
md: 1rem (16px)
lg: 1.5rem (24px)
xl: 2rem (32px)
```

### Components

**Cards:**
```jsx
<div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
  {/* Content */}
</div>
```

**Buttons:**
```jsx
// Primary
<button className="bg-gradient-to-r from-sky-700 to-sky-900 text-white px-6 py-3 rounded-lg hover:from-sky-800 hover:to-sky-950 transition-all active:scale-[0.98]">

// Secondary
<button className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300">

// Danger
<button className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600">
```

**Inputs:**
```jsx
<input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent text-base" />
```

**Modals:**
```jsx
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] flex flex-col">
    {/* Sticky header, scrollable body, sticky footer */}
  </div>
</div>
```

### Sidebar States
```jsx
// Expanded (default)
width: 288px (w-72)
Logo: 96px
Icons: Full labels visible

// Collapsed
width: 80px (w-20)
Logo: 40px
Icons: Only icons visible
Tooltips: Shown on hover

// Transition
transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## 🔐 **Authentication & Security**

### JWT Implementation
```javascript
// Login endpoint
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  // Verify password
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });
  
  // Generate token
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  
  res.json({ token, user: { username, role: user.role } });
});
```

### Protected Routes
```javascript
// Middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Usage
router.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Access granted', user: req.user });
});
```

### Frontend Token Storage
```javascript
// api.js
const token = localStorage.getItem('token');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Login component
const handleLogin = async () => {
  const response = await api.post('/auth/login', { username, password });
  localStorage.setItem('token', response.data.token);
  api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
};

// Logout
const handleLogout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};
```

### Password Hashing
```javascript
// User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

---

## 🐛 **Troubleshooting**

### MongoDB Connection Issues

**Problem:** "MongooseError: Connection failed"

**Solutions:**
```bash
# 1. Check if MongoDB is running
mongosh

# 2. Start MongoDB service
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# 3. Check MongoDB URI in .env
MONGODB_URI=mongodb://localhost:27017/bakery-pos

# 4. For MongoDB Atlas, check:
# - Network access (whitelist IP)
# - Database user credentials
# - Connection string format
```

### Port Already in Use

**Problem:** "Error: listen EADDRINUSE: address already in use :::5000"

**Solutions:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Or change port in server/.env
PORT=5001
```

### Network Access Not Working

**Problem:** Can't access from mobile on network

**Checklist:**
1. ✅ Both devices on same WiFi network
2. ✅ Firewall allows ports 5173 and 5000
3. ✅ Server shows network URL in console
4. ✅ Using correct IP address (not localhost)

**Windows Firewall:**
```powershell
# Allow frontend port
netsh advfirewall firewall add rule name="Vite" dir=in action=allow protocol=TCP localport=5173

# Allow backend port
netsh advfirewall firewall add rule name="Node" dir=in action=allow protocol=TCP localport=5000
```

**Test connectivity:**
```bash
# From mobile browser, try:
http://<your-ip>:5173

# If this shows connection refused:
# - Check firewall
# - Verify IP with ipconfig/ifconfig
# - Restart both servers
```

### Login Issues

**Problem:** "Invalid credentials" or "Network Error"

**Solutions:**
```bash
# 1. Verify admin user exists
cd server
mongosh
use bakery-pos
db.users.find()

# 2. Recreate admin user
node create-admin.js

# 3. Check API URL in browser DevTools
# Should show: http://<IP>:5000/api (not localhost on mobile)

# 4. Verify backend is running
curl http://localhost:5000/api/ingredients
```

### Stock Not Deducting

**Problem:** Orders create but stock doesn't reduce

**Debug:**
```javascript
// Check Order model post-save hook
orderSchema.post('save', async function(doc) {
  console.log('Order saved:', doc._id);
  // Hook should execute after save
});

// Verify ingredients have stock
db.ingredients.find({ currentStock: { $gt: 0 } })

// Check for errors in server console
```

### Recipe Cost Not Updating

**Problem:** Ingredient price changed but recipe cost same

**Solutions:**
```bash
# 1. Check if using purchase bill stock update
# (Only stock update from purchase bills triggers recalculation)

# 2. Manual recalculation script
cd server
node recalculate-all-recipes.js

# 3. Verify function in purchaseBills.js
# Should call: await recalculateRecipeCosts(ingredient._id);
```

### Mobile UI Issues

**Problem:** Buttons too small, inputs zooming, layout broken

**Solutions:**
```css
/* Check index.css has mobile optimizations */

/* 1. Touch targets */
button, input { min-height: 48px; }

/* 2. Prevent zoom */
input { font-size: 16px; }

/* 3. Responsive grid */
.grid { grid-template-columns: 1fr; }
@media (min-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}

/* 4. Modal height */
.modal { max-height: 95vh; }
```

---

## 🚀 **Production Deployment**

### Environment Variables

Create `server/.env.production`:
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bakery-pos
JWT_SECRET=super-secret-key-change-this
PORT=5000
```

### Build Frontend

```bash
npm run build
```

This creates `dist/` folder with optimized static files.

### Deployment Options

#### 1. **Vercel (Frontend) + MongoDB Atlas (Database)**

**Frontend (Vercel):**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables in Vercel dashboard:
VITE_API_URL=https://your-backend-url.com/api
```

**Backend (Render/Railway/Fly.io):**
- Push to GitHub
- Connect repository
- Set environment variables
- Deploy

#### 2. **DigitalOcean / AWS / Azure (Full Stack)**

```bash
# Install Node.js and MongoDB
# Clone repository
git clone <repo>

# Install PM2 for process management
npm i -g pm2

# Start backend
cd server
pm2 start server.js --name bakery-backend

# Build and serve frontend with nginx
cd ..
npm run build

# nginx config
server {
  listen 80;
  server_name yourdomain.com;
  
  location / {
    root /path/to/bakery-pos/dist;
    try_files $uri /index.html;
  }
  
  location /api {
    proxy_pass http://localhost:5000;
  }
}
```

#### 3. **Docker Deployment**

Create `Dockerfile`:
```dockerfile
# Backend
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --production
COPY server/ ./
EXPOSE 5000
CMD ["node", "server.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/bakery-pos
    depends_on:
      - mongo
  
  mongo:
    image: mongo:5
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run:
```bash
docker-compose up -d
```

### Security Checklist

- [ ] Change default admin password
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set CORS whitelist
- [ ] Use environment variables (never commit .env)
- [ ] Enable MongoDB authentication
- [ ] Set up database backups
- [ ] Use rate limiting
- [ ] Add helmet.js for security headers
- [ ] Sanitize user inputs

---

## 📝 **Development Workflow**

### Adding a New Feature

1. **Create feature branch:**
```bash
git checkout -b feature/your-feature-name
```

2. **Frontend component:**
```jsx
// src/components/NewFeature.jsx
import { useState, useEffect } from 'react';
import api from '../services/api';

export default function NewFeature() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    const response = await api.get('/your-endpoint');
    setData(response.data);
  };
  
  return <div>{/* UI */}</div>;
}
```

3. **Backend route:**
```javascript
// server/routes/yourRoute.js
const express = require('express');
const router = express.Router();
const YourModel = require('../models/YourModel');

router.get('/', async (req, res) => {
  try {
    const data = await YourModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

4. **Add to App.jsx:**
```jsx
import NewFeature from './components/NewFeature';

// In navigation
case 'newFeature':
  return <NewFeature />;
```

5. **Test and commit:**
```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### Code Style Guidelines

**JavaScript/React:**
- Use ES6+ syntax (arrow functions, destructuring, async/await)
- Functional components with hooks (no class components)
- Meaningful variable names (camelCase)
- Comments for complex logic
- Extract reusable logic into custom hooks

**CSS/Tailwind:**
- Use Tailwind utilities first
- Custom CSS only when necessary
- Mobile-first responsive design
- Consistent spacing (Tailwind scale)

**API Design:**
- RESTful conventions
- Descriptive endpoint names
- Consistent response format:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Optional message"
  }
  ```

---

## 🔮 **Roadmap & Future Enhancements**

### Planned Features

#### Phase 1 (Q1 2026)
- [ ] **Dark Mode** - System preference detection + manual toggle
- [ ] **PDF Invoice Generation** - Professional bills with logo
- [ ] **Excel Export** - Analytics data export
- [ ] **Barcode Scanner** - Quick ingredient entry
- [ ] **Recipe Scaling** - Batch size calculator

#### Phase 2 (Q2 2026)
- [ ] **Multi-User Roles** - Admin, Manager, Cashier permissions
- [ ] **Employee Management** - Staff tracking and shifts
- [ ] **Supplier Management** - Vendor database
- [ ] **Low Stock Alerts** - Email/SMS notifications
- [ ] **Waste Tracking** - Spoilage and wastage logging

#### Phase 3 (Q3 2026)
- [ ] **Cloud Backup** - Automated daily backups
- [ ] **Multi-Location** - Manage multiple bakery branches
- [ ] **Payment Gateway** - Online payment integration
- [ ] **Customer App** - Mobile app for customers
- [ ] **Loyalty Program** - Points and rewards system

#### Phase 4 (Q4 2026)
- [ ] **AI Demand Forecasting** - Predict daily sales
- [ ] **Auto-Reordering** - Smart purchase suggestions
- [ ] **QR Code Menus** - Digital menu with QR
- [ ] **Delivery Integration** - Zomato/Swiggy sync
- [ ] **Accounting Integration** - Tally/QuickBooks sync

### Contribution Ideas

Want to contribute? Here are some areas:

- **Performance:** Optimize large dataset handling
- **Testing:** Unit tests with Jest, E2E with Cypress
- **Accessibility:** WCAG 2.1 compliance
- **Internationalization:** Multi-language support
- **Offline Mode:** PWA with service workers
- **Voice Commands:** Hands-free order entry

---

## 📄 **License**

This project is proprietary software developed for bakery management.  
All rights reserved © 2026 Tins & Trays Bakery

---

## 👥 **Credits & Acknowledgments**

### Development
- **Primary Developer:** Bakery POS Team
- **UI/UX Design:** Modern gradient themes with glass morphism
- **Database Design:** MongoDB schema optimization

### Technologies
- **React Team:** React 19 framework
- **Vite Team:** Lightning-fast build tool
- **Tailwind Labs:** Tailwind CSS
- **MongoDB Inc:** Database platform
- **Lucide Icons:** Beautiful icon library

### Branding
- **Logo Design:** Tins & Trays custom branding
- **Color Palette:** Sky blue gradient theme
- **Typography:** System fonts for performance

---

## 📞 **Support & Contact**

### Getting Help

**Documentation:**
- This README file (comprehensive guide)
- Code comments in source files
- API endpoint documentation above

**Issues & Bugs:**
- Open an issue on GitHub (if using Git)
- Email: admin@bakery.com
- Include: Error message, steps to reproduce, screenshots

**Feature Requests:**
- Submit via GitHub Issues with label "enhancement"
- Describe use case and expected behavior
- Include mockups if applicable

**Community:**
- Developer discussions: GitHub Discussions
- Updates: Check changelog in commits

---

## 🎯 **Quick Start Checklist**

Use this checklist for first-time setup:

### Installation
- [ ] Node.js 18+ installed ([nodejs.org](https://nodejs.org))
- [ ] MongoDB 5.0+ installed or Atlas account
- [ ] Git installed (optional)

### Setup
- [ ] Clone/extract repository
- [ ] `npm install` in root directory
- [ ] `cd server && npm install`
- [ ] MongoDB running (`net start MongoDB`)
- [ ] `cd server && node create-admin.js`

### Running
- [ ] Terminal 1: `cd server && node server.js`
- [ ] Terminal 2: `npm run dev` (from root)
- [ ] Open http://localhost:5173
- [ ] Login with admin/admin123

### Configuration
- [ ] Change admin password in app
- [ ] Add categories (Cakes, Brownies, etc.)
- [ ] Add ingredients with units and costs
- [ ] Create first recipe
- [ ] Add test customer
- [ ] Create first order

### Production (Optional)
- [ ] Build frontend (`npm run build`)
- [ ] Set up MongoDB Atlas
- [ ] Configure environment variables
- [ ] Deploy backend (Render/Railway)
- [ ] Deploy frontend (Vercel/Netlify)
- [ ] Test on production URL
- [ ] Enable HTTPS
- [ ] Set up backups

---

## 📚 **Additional Resources**

### Documentation
- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [MongoDB Manual](https://www.mongodb.com/docs/manual/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Tutorials
- [JWT Authentication](https://jwt.io/introduction)
- [Mongoose Schemas](https://mongoosejs.com/docs/guide.html)
- [React Hooks](https://react.dev/reference/react)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

### Tools
- [MongoDB Compass](https://www.mongodb.com/products/compass) - GUI for MongoDB
- [Postman](https://www.postman.com/) - API testing
- [VS Code](https://code.visualstudio.com/) - Recommended editor
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debugging

---

## 📊 **System Status**

| Component | Status | Version | Notes |
|-----------|--------|---------|-------|
| Frontend | ✅ Production Ready | 1.0.0 | React 19, Vite 7.3 |
| Backend | ✅ Production Ready | 1.0.0 | Node.js, Express |
| Database | ✅ Production Ready | MongoDB 5.0+ | Local or Atlas |
| Authentication | ✅ Implemented | JWT | 7-day tokens |
| Mobile Support | ✅ Optimized | Responsive | Touch-friendly |
| Network Access | ✅ Configured | LAN | Multi-device ready |

---

**Version:** 1.0.0  
**Last Updated:** January 18, 2026  
**Status:** ✅ Production Ready  
**Total Documentation:** Comprehensive (100+ sections)

**Happy Baking! 🍰**

### Orders
- `GET /api/orders` - Get all orders
- `POST /api/orders` - Create order (auto-deducts stock & generates bill)
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Bills
- `GET /api/bills` - Get all bills (with date filtering)
- `GET /api/bills/:id` - Get bill by ID
- `GET /api/bills/number/:billNumber` - Get bill by number
- `DELETE /api/bills/:id` - Delete bill

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/revenue-trend?days=7` - Revenue trend
- `GET /api/analytics/top-products?limit=5` - Top selling products
- `GET /api/analytics/ingredient-usage` - Ingredient usage stats
- `GET /api/analytics/sales-by-category` - Sales by category
- `GET /api/analytics/recent-orders?limit=5` - Recent orders

---

## 🎨 **UI/UX Features**

### Menula-Inspired Design
- Clean, light theme with subtle shadows
- Professional color palette (primary red: #d42f46)
- Minimal, spacious layouts
- Touch-friendly button sizes (optimized for tablets)
- Modern Inter font family

### User Experience
- Smooth animations and transitions
- Hover effects on interactive elements
- Loading states for async operations
- Empty state illustrations
- Success/error notifications
- Responsive modals
- Print-friendly invoice templates

---

## 💡 **How It Works**

### Creating a Recipe
1. Navigate to **Recipes** page
2. Click **"Add Recipe"**
3. Enter recipe name, category, and selling price
4. Add ingredients from your inventory with quantities needed
5. System automatically calculates cost price and profit margin
6. Save recipe

### Processing an Order
1. Navigate to **Orders** page
2. Click **"New Order"**
3. Click on products to add them to cart
4. Adjust quantities using +/- buttons
5. Enter customer name (optional)
6. Select payment method
7. Click **"Create Order"**
8. System automatically:
   - Checks ingredient availability
   - Deducts ingredients from stock
   - Generates a bill with unique bill number
   - Updates recipe's total sold count
   - Adds to revenue tracking

### Viewing & Printing Bills
1. Navigate to **Bills** page
2. Search or filter bills
3. Click **"View"** to see invoice details
4. Click **"Print"** for professional formatted invoice
5. Invoice opens in new window with print dialog

### Monitoring Analytics
1. Navigate to **Analytics** page
2. View key metrics (Revenue, Orders, Avg Order Value)
3. Analyze charts:
   - Revenue trend over last 7 days
   - Top 5 selling products
   - Sales distribution by category
4. Review product performance table

---

## 🔧 **Configuration**

### Tailwind Theme Customization

Edit `tailwind.config.js` to customize colors:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
      }
    }
  }
}
```

### Tax Rate

Edit `src/components/Orders.jsx`:

```javascript
const calculateTax = (subtotal) => {
  return subtotal * 0.05; // Change 0.05 to your tax rate
};
```

---

## 📦 **Deployment**

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Backend (Railway/Render)

1. Push code to GitHub
2. Connect Railway/Render to repository
3. Set environment variables:
   - `MONGODB_URI`
   - `PORT=5000`
   - `NODE_ENV=production`
4. Deploy from `server/` directory

### Database (MongoDB Atlas)

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get connection string
3. Update `.env` with Atlas URI
4. Add IP whitelist (0.0.0.0/0 for all IPs)

---

## 🐛 **Troubleshooting**

### Backend won't start
```bash
# Check if MongoDB is running
# For local MongoDB:
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # Mac

# Check port 5000 is available
lsof -i :5000
```

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check `src/services/api.js` baseURL
- Check browser console for CORS errors

### MongoDB connection error
- Verify MongoDB is running
- Check connection string in `.env`
- For Atlas: verify IP whitelist settings

---

## 📝 **Sample Data**

The system comes with scripts to populate test data:

```bash
# Clear database and add fresh test data
cd server
node clear-database.js
node populate-test-data.js
```

This creates:
- **8 Ingredients:** Flour, Sugar, Butter, Eggs, Milk, Vanilla, Cocoa, Baking Powder
- **5 Recipes:** Chocolate Cake, Vanilla Cupcakes, Butter Cookies, White Bread, Croissant
- **3 Orders:** With different customers and payment methods

---

## 🎯 **Future Enhancements**

- [ ] User authentication & roles (Admin, Cashier, Manager)
- [ ] Customer database with purchase history
- [ ] Loyalty points system
- [ ] Multi-location support
- [ ] Email bill delivery
- [ ] SMS notifications
- [ ] Dark mode toggle
- [ ] Export reports (PDF/CSV)
- [  ] Recipe photos/images
- [ ] Barcode scanner integration
- [ ] PWA for offline mode

---

## 🤝 **Contributing**

This is a personal/commercial project. For suggestions:
1. Fork the repository
2. Create feature branch
3. Submit pull request

---

## 📄 **License**

MIT License - Free to use for commercial bakery operations!

---

## 🆘 **Support**

For issues or questions:
- Check the Troubleshooting section above
- Review code comments in source files
- Check browser console for errors
- Verify MongoDB connection

---

## 👏 **Acknowledgments**

- **UI/UX Inspiration:** Menula Restaurant POS
- **Charts:** Chart.js
- **Icons:** Heroicons (inline SVG)
- **Fonts:** Google Fonts (Inter)

---

**Built with ❤️ for bakeries everywhere** 🍰

*Version 1.0.0 - Production Ready*
