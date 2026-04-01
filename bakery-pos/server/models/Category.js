import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    icon: {
        type: String,
        default: '📦'
    },
    color: {
        type: String,
        default: '#3B82F6' // Default blue color
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
