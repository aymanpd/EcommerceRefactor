const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const moment = require('moment');
const tryCatch = require('../utils/tryCatch');
const Order = require('../models/order');
const Product = require('../models/product');
const appError = require('../utils/appError');

const validateLineItems = async lineItems => {
	let orderTotal = 0;
	const validatedLineItems = await Promise.all(
		lineItems.map(async item => {
			const product = await Product.findById(item.productId);
			let onSale = false;

			if (product.onSaleFrom && product.onSaleTo && product.salePrice) {
				onSale = moment().isBetween(
					moment(product.onSaleFrom),
					moment(product.onSaleTo)
				);
			}
			var total = onSale
				? product.salePrice * item.qty
				: product.regularPrice * item.qty;
			orderTotal += total;
			return {
				...item,
				onSale,
				salePrice: product.salePrice,
				price: product.regularPrice,
				total,
				name: product.name,
				description: product.description
			};
		})
	);
	return { orderTotal, validatedLineItems };
};

const getOrder = tryCatch(async (req, res, next) => {
	const orderId = req.params.id;
	const order = await Order.findById(orderId).populate('lineItems.productId');
	if (!order) {
		return next(new appError('Order Not Found', 404));
	}
	res.send(order);
});

const cancelOrder = tryCatch(async (req, res, next) => {
	const orderId = req.params.id;
	const order = await Order.findOne({ _id: orderId, status: 'pending' });
	if (!order) {
		return next(new appError('Order Not Found', 404));
	}
	order.status = 'cancelled';
	await order.save();
	res.send(`order ${order.id} was cancelled successfully`);
});

const updateOrderStatus = tryCatch(async (req, res, next) => {
	const order = await Order.findById(req.params.id);
	if (!order) {
		return next(new appError('Order Not Found', 404));
	}
	if (!req.params.status) {
		return next(new appError('please add the new status', 400));
	}
	order.status = req.params.status;
	await order.save();
	res.status(201).send('order was approved successfully');
});

const listOrders = tryCatch(async (req, res, next) => {
	const { page, filter } = req.query;
	if (!filter || filter == 'all') {
		var orders = Order.find();
		var pages = (await Order.countDocuments()) / 10;
	} else {
		var orders = Order.find({ status: filter });
		pages = (await Order.countDocuments({ status: filter })) / 10;
	}
	orders = await orders
		.sort({ createdAt: -1 })
		.limit(10)
		.skip(10 * (page ? page - 1 : 0));
	res.send({ orders, pages: Math.ceil(pages) });
});

const getCheckoutSession = tryCatch(async (req, res, next) => {
	const { lineItems, orderNote, email, phone } = req.body;
	const { orderTotal, validatedLineItems } = await validateLineItems(lineItems);

	const order = await new Order({
		status: 'processing',
		paymentMethod: 'stripe',
		orderNote,
		lineItems: validatedLineItems,
		shippingAddress: {
			email: email,
			phone: phone
		}
	}).save();

	// create checkout session
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/`,
		cancel_url: `${req.protocol}://${req.get('host')}/`,
		billing_address_collection: 'required',
		customer_email: email,
		client_reference_id: order.id,
		line_items: validatedLineItems.map(item => ({
			amount: item.total * 100,
			name: `${item.name} / ${item.color} / ${item.size}`,
			currency: 'usd',
			quantity: item.qty,
			description: item.description
		}))
	});
	res.status(200).send(session);
});

const placeOrder = tryCatch(async (req, res, next) => {
	const { lineItems, shippingAddress, orderNote } = req.body;
	const { orderTotal, validatedLineItems } = await validateLineItems(lineItems);

	const order = await new Order({
		status: 'pending',
		shippingAddress,
		orderNote,
		paymentMethod: 'cashOnDelivery',
		lineItems: validatedLineItems,
		total: orderTotal
	}).save();

	res.status(200).send(order);
});

module.exports = {
	getOrder,
	cancelOrder,
	listOrders,
	getCheckoutSession,
	placeOrder,
	updateOrderStatus
};
