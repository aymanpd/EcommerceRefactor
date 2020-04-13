const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        default: 'published',
        enum: ['draft', 'published']
    },
    featured: {
        type: Boolean,
        default: false
    },

    regularPrice: {
        type: Number,
        required: [true, 'Product price is required'],
        min: 1
    },
    salePrice: {
        type: Number,
        min: 0
    },
    onSaleFrom: Date,
    onSaleTo: Date,
    stockStatus: {
        type: String,
        enum: ['instock', 'outofstock', 'onbackorder'],
        default: 'instock'
    },
    //changed
    colors: {
        type: [{
            colorName: { type: String, required: [true, 'Each color must have a name'] },
            sizes: [{
                type: [String],
                enum: ['xxl', 'xl', 'l', 'm', 's', 'xs'],
            }],
            primaryImage: { type: String, required: [true, 'Product primary image is required'] },
            secondaryImage: { type: String },
            gallery: [String]
        }],
        required: "true"
    },
    category: {
        required: [true, "Each product must be in category"],
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category'
    },
    specifications: [{ type: String, trim: true }],

    similarProducts: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: 'Product'
    },

}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });


productSchema.methods.toJSON = function () {
    const product = this;
    const productObject = product.toObject();

    return productObject;
}

// productSchema.index({ name: 'text' });

productSchema.index({ category: 1 });
productSchema.index({ createdAt: -1 });


const Product = mongoose.model('Product', productSchema);

module.exports = Product;