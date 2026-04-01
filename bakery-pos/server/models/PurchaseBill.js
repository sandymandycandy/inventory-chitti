import mongoose from 'mongoose';

const purchaseBillItemSchema = new mongoose.Schema({
    ingredient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ingredient',
        required: true
    },
    ingredientName: String,
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unit: String,
    pricePerUnit: {
        type: Number,
        required: true,
        min: 0
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const purchaseBillSchema = new mongoose.Schema({
    billNumber: {
        type: String,
        required: true,
        unique: true
    },
    supplierName: {
        type: String,
        required: true,
        trim: true
    },
    supplierPhone: {
        type: String,
        default: ''
    },
    supplierAddress: {
        type: String,
        default: ''
    },
    items: [purchaseBillItemSchema],
    subtotal: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        default: 0,
        min: 0
    },
    total: {
        type: Number,
        required: true,
        min: 0
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Pending', 'Partial'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'Credit'],
        default: 'Cash'
    },
    notes: {
        type: String,
        default: ''
    },
    stockUpdated: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Auto-generate bill number
purchaseBillSchema.pre('save', async function (next) {
    if (!this.billNumber) {
        const count = await mongoose.model('PurchaseBill').countDocuments();
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        this.billNumber = `PB${year}${month}${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

const PurchaseBill = mongoose.model('PurchaseBill', purchaseBillSchema);

export default PurchaseBill;
