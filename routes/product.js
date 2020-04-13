const express = require('express');
const productController = require('../controllers/productController');
const Product = require('../models/product');
const productRoute = new express.Router;


// Create A Product Endpoint
productRoute.post('/create', productController.createProduct)

// Update A Product Endpoint
productRoute.patch('/:id/update', productController.updateProduct);

// List All Products Endpoint
productRoute.get('/all', productController.getAllProducts);

// Delete A Product Endpoint
// Retrive A Product With Id Endpoint
productRoute.route('/single/:id')
    .delete(productController.deleteProduct)
    .get(productController.getProductById);

// name
// status
// colors
// specifications
// featured
// description
// regularPrice
// salePrice
// onSaleFrom
// onSaleTo
// purchasable
// stockQuantity
// stockStatus
// reviewsAllowed
// similarProducts
// category

//5ddaa173eac3721f1c6b6e83
// regular price
// colors
productRoute.get('/loadDummy', (req, res) => {
    const dummy = [
        { name: "Sportive men's breatable lacing flat sneakers B1", colors: ["white", "black", "grey"] },
        { name: "Casual men's lacing pure color soft bottom sneakersr", colors: ["black", 'white'] },
        { name: "Men's Casual Colorblock Mesh Breathable Lace Up Sneakers", colors: ["black", 'white'] },
        { name: " Men's casual mesh breathable sneakers wq09r", colors: ["gray", "black", "cornsilk"] },
        { name: "Men's Casual Non-slip Breathable Round Toe Sneakers", colors: ["gray", "black", "red"] },
        { name: "Men's versatile breathable lace-up sneakersr ", colors: ["white", "darkgray"] },
        { name: "Men's casual colorblock breathable non-slip sneakers", colors: ["white"] },
        { name: "Men Breathable Round Toe Patchwork Sneakers", colors: ["black", 'gold'] },
        { name: "Men's Casual Colorblock Non-slip Sneakers", colors: ["white", 'red'] },
        { name: "Men's Casual Colorblock Lace Up Sneakers", colors: ["black", 'black'] },
        { name: "Men's Casual Mesh Solid Color Sneakers", colors: ["white", "black"] },
    ];
    const sizes = ['xxl', 'xl', 'l', 'm', 's', 'xs'];
    dummy.forEach((product) => {
        product.category = "5ddc5a4d5a3bbc1f84d940a9";
        product.regularPrice = Math.round(Math.random() * 800);
        product.colors = product.colors.map((color) => ({ colorName: color, sizes: [...sizes].splice(Math.floor(Math.random() * 5) + 1, Math.floor(Math.random() * 6) + 1) }));
        new Product(product).save();
    })
})
// load cart 
productRoute.post('/cart', productController.loadCart)
module.exports = productRoute;

