const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
	{
		status: {
			type: String,
			default: 'pending',
			enum: [
				'processing',
				'pending',
				'approved',
				'completed',
				'cancelled',
				'failed'
			]
		},
		// discount_total: Number,
		total: Number,
		// customer: {
		//     type: mongoose.SchemaTypes.ObjectId,
		//     ref: 'Customer'
		// },
		// customer_ip_address: String,
		shippingAddress: {
			firstName: {
				type: String
				// required: [true, 'firstName is required']
			},
			lastName: {
				type: String
				//  required: [true, 'lastName is required']
			},
			address: {
				type: String
				//  required: [true, 'address_1 is required']
			},
			'address 2': {
				type: String
			},
			country: {
				type: String
				//  required: [true, 'Country is required']
			},
			state: {
				type: String
				//  required: [true, 'state is required']
			},
			postcode: {
				type: String
			},

			email: {
				type: String,
				required: [true, 'email is required']
			},
			phone: {
				type: Number,
				required: [true, 'phone is required']
			}
		},
		paymentMethod: {
			type: String,
			enum: ['cashOnDelivery', 'stripe']
		},
		orderNote: { type: String, trim: true },
		datePaid: Date,
		dateCompleted: Date,
		lineItems: [
			{
				productId: {
					type: mongoose.SchemaTypes.ObjectId,
					ref: 'Product'
				},
				qty: Number,
				color: String,
				size: String,
				total: Number,
				price: Number,
				onSale: Boolean,
				salePrice: Number
			}
		]
	},
	{ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
