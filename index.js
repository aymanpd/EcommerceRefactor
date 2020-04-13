require('./db/mongoose-config');
const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const productRoute = require('./routes/product');
const customerRoute = require('./routes/customer');
const categoryRoute = require('./routes/category');
const orderRoute = require('./routes/order');
const errorHandler = require('./middleware/errorHandler');
const appError = require('./utils/appError');
const fs = require('fs');

const app = express();

app.use(express.json({ limit: '10000kb' }));
app.use(cors());
app.use(compression());

//routes

app.use('/api/images', express.static('images'));
app.use('/api/categoryImages', express.static('categoryImages'));
app.use('/api/customers', customerRoute);
app.use('/api/products', productRoute);
app.use('/api/category', categoryRoute);
app.use('/api/order', orderRoute);
app.use(errorHandler);

// serving static assets in production
if (process.env.NODE_ENV == 'production') {
	app.use(express.static('./client/build'));
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}

// app.all('*', (req, res, next) => {
//     return next(new appError('Looks like you hit the wrong route', 404));
// });

app.listen(process.env.PORT, () => {
	console.log('server is running port:', process.env.PORT);
});
