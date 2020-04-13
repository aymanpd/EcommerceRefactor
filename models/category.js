const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: [true, 'Category with the same name already exists'],
        trim: true
    },
    parent: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Category',
    },

    description: { type: String, trim: true },
    image: { type: String },

});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;