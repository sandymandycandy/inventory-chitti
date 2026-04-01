import mongoose from 'mongoose';

const billSchema = new mongoose.Schema({
    billNumber: {
        type: String,
        unique: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    customerName: String,
    items: [{
        name: String,
        quantity: Number,
        price: Number,
        total: Number
    }],
    subtotal: Number,
    packingCharges: {
        type: Number,
        default: 0
    },
    tax: Number,
    total: Number,
    paymentMethod: String,
    issuedDate: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Generate bill number
billSchema.pre('save', async function (next) {
    if (!this.billNumber) {
        const now = new Date();
        const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        const count = await mongoose.model('Bill').countDocuments({
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        this.billNumber = `BILL-${dateStr}-${String(count + 1).padStart(4, '0')}`;
    }
    next();
});

const Bill = mongoose.model('Bill', billSchema);

export default Bill;
