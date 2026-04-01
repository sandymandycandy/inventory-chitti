import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    loyaltyPoints: {
        type: Number,
        default: 0,
        min: 0
    },
    totalSpent: {
        type: Number,
        default: 0,
        min: 0
    },
    totalOrders: {
        type: Number,
        default: 0,
        min: 0
    },
    lastVisit: {
        type: Date
    },
    notes: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for customer tier based on total spent
customerSchema.virtual('tier').get(function () {
    if (this.totalSpent >= 10000) return 'Gold';
    if (this.totalSpent >= 5000) return 'Silver';
    if (this.totalSpent >= 1000) return 'Bronze';
    return 'Regular';
});

// Method to add points (1 point per ₹100 spent)
customerSchema.methods.addPoints = function (orderTotal) {
    const pointsEarned = Math.floor(orderTotal / 100);
    this.loyaltyPoints += pointsEarned;
    return pointsEarned;
};

// Method to redeem points (100 points = ₹100 discount)
customerSchema.methods.redeemPoints = function (points) {
    if (points > this.loyaltyPoints) {
        throw new Error('Insufficient loyalty points');
    }
    this.loyaltyPoints -= points;
    return points; // Returns discount amount
};

// Method to record purchase
customerSchema.methods.recordPurchase = function (orderTotal) {
    this.totalSpent += orderTotal;
    this.totalOrders += 1;
    this.lastVisit = new Date();
};

// Ensure virtuals are included in JSON
customerSchema.set('toJSON', { virtuals: true });
customerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Customer', customerSchema);
