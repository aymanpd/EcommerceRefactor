const mongoose = require('mongoose');

const productReviewSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
    },
    status: {
        type: String,
        enum: ['approved', 'hold', 'spam', 'unspam', 'trash', 'untrash']
    },
    reviewer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Customer'
    },
    rating: {
        type: Number,
        max: 5,
        min: 0
    },
    review: {
        type: String,
        trim: true
    },
    verified: Boolean


}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })

const ProductReview = mongoose.model('ProductReview', productReviewSchema);
module.exports = ProductReview;