const express = require('express');
const orderRoute = new express.Router;

const ordercontroller = require('../controllers/orderController');

// Create Order
orderRoute.get('/all', ordercontroller.listOrders);
orderRoute.get('/:id', ordercontroller.getOrder);
orderRoute.delete('/:id', ordercontroller.cancelOrder);
orderRoute.post('/checkout-session', ordercontroller.getCheckoutSession);
orderRoute.post('/place-order', ordercontroller.placeOrder);
orderRoute.patch('/update-status/:id/:status', ordercontroller.updateOrderStatus);

module.exports = orderRoute;