import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    recipeName: String,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    subtotal: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        unique: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        default: null
    },
    customerName: {
        type: String,
        default: 'Walk-in Customer'
    },
    customerPhone: {
        type: String,
        default: null
    },
    items: [orderItemSchema],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0
    },
    packingCharges: {
        type: Number,
        default: 0,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    taxPercentage: {
        type: Number,
        default: 5,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    loyaltyPointsUsed: {
        type: Number,
        default: 0,
        min: 0
    },
    loyaltyPointsEarned: {
        type: Number,
        default: 0,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'completed'
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'upi', 'other'],
        default: 'cash'
    },
    notes: String
}, {
    timestamps: true
});

// Generate order number
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const count = await mongoose.model('Order').countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        this.orderNumber = `ORD-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
