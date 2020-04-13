const express = require('express');
const categoryController = require('../controllers/categoryController');

const categoryRoute = new express.Router;

// Add New Category 
categoryRoute.post('', categoryController.createCategory)
// Get Category By Id
categoryRoute.get('/:id', categoryController.getCategoryById);
// Update Category
categoryRoute.patch('/:id', categoryController.updateCategory);
// Get All Categories 
categoryRoute.get('', categoryController.getAllCategories);



module.exports = categoryRoute;