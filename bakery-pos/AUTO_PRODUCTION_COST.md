# Automatic Production Cost Calculation

## Overview
Production cost is now **automatically calculated** based on recipe ingredients and their costs. When you add or modify ingredients in a recipe, the production cost updates instantly.

## How It Works

### Backend (Automatic Calculation)
1. **Pre-Save Hook** in Recipe Model:
   - When a recipe is created or ingredients are modified
   - System fetches cost per unit for each ingredient
   - Calculates: `Production Cost = Σ (Quantity × Cost Per Unit)`
   - Automatically saves the calculated value

### Frontend (Real-Time Display)
1. **Recipes Tab**:
   - Production cost field is **read-only** (disabled)
   - Shows green checkmark: "✓ Automatically calculated from ingredients"
   - Updates in real-time as you add/change ingredients
   - Displays current cost based on selected ingredients

2. **Product Pricing Tab**:
   - Shows production cost (auto-calculated from Recipes tab)
   - Displays info: "ℹ️ Auto-calculated from ingredients in Recipes tab"
   - Focus on pricing and profit margins

## Example Calculation

**Recipe:** Chocolate Cake

| Ingredient | Quantity | Cost Per Unit | Subtotal |
|------------|----------|---------------|----------|
| Flour      | 2 kg     | ₹40/kg       | ₹80.00   |
| Sugar      | 1 kg     | ₹50/kg       | ₹50.00   |
| Cocoa      | 0.5 kg   | ₹200/kg      | ₹100.00  |
| Butter     | 0.5 kg   | ₹400/kg      | ₹200.00  |

**Auto-Calculated Production Cost:** ₹430.00

## Workflow

### Creating a New Recipe
1. Go to **Recipes** tab
2. Click "Add Recipe"
3. Enter recipe name, category, selling price
4. **Add Ingredients:**
   - Select ingredient from dropdown
   - Enter quantity needed
   - Production cost updates automatically!
5. Add image (optional)
6. Save recipe

### Editing an Existing Recipe
1. Click "Edit" on any recipe
2. Modify ingredients:
   - Change quantities
   - Add new ingredients
   - Remove ingredients
3. Watch production cost update in real-time
4. Save changes

### Updating Ingredient Costs
When you update an ingredient's cost per unit in the **Inventory** tab:
1. All existing recipes keep their current production cost
2. New recipes or edited recipes will use the new ingredient cost
3. To refresh production costs, edit the recipe and save

## Benefits

✅ **Accuracy:** No manual calculation errors  
✅ **Speed:** Instant cost updates  
✅ **Consistency:** All costs calculated the same way  
✅ **Profit Visibility:** Immediate profit margin calculation  
✅ **Easy Updates:** Change ingredient, cost updates automatically

## Technical Details

### Files Modified
1. `server/models/Recipe.js` - Added pre-save hook
2. `server/routes/recipes.js` - Updated to use save() instead of findByIdAndUpdate
3. `src/components/Recipes.jsx` - Added calculateProductionCost() function
4. `src/components/ProductPricing.jsx` - Updated labels and info text

### Database
- Field: `productionCost` (Number)
- Auto-calculated on recipe create/update
- Stored in database for historical tracking

### API Behavior
- POST `/api/recipes` - Production cost calculated automatically
- PUT `/api/recipes/:id` - Production cost recalculated on update
- No need to send productionCost in request body

## Notes

⚠️ **Important:**
- Production cost is calculated based on **current** ingredient costs
- Historical recipes maintain their original production cost until edited
- Ensure ingredient costs are up-to-date in Inventory

📊 **Profit Calculation:**
- Profit = Selling Price - Production Cost
- Margin % = (Profit / Selling Price) × 100
- Displayed in real-time as you enter prices

## Date Implemented
January 17, 2026
