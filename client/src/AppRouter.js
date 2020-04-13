import React, { useEffect } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import 'typeface-roboto';
import axiosInstance from './utils/axiosInstance';
// redux
import { connect } from 'react-redux';
import { loadCart } from './components/cart/cartReducer';
//navbar
import Navbar from './components/navbar/Navbar';
// products
import CreateProduct from './layout/products/CreateProduct';
import UpdateProduct from './layout/products/UpdateProduct';
import AdminProducts from './layout/products/AdminProducts';
import ListProducts from './layout/products/ListProducts';
import SingleProduct from './layout/products/SingleProduct';
//categories
import CreateCategory from './layout/categories/CreateCategory';
import UpdateCategory from './layout/categories/UpdateCategory';
//cart
import Cart from './layout/cart/Cart';
//checkout
import CheckOut from './layout/checkout/CheckOut';
import OrderPlaced from './layout/checkout/OrderPlaced';
//
import Home from './layout/Home';
import AdminDashboard from './layout/AdminDashboard';

function App({ loadCart }) {
	useEffect(() => {
		const items =
			localStorage.getItem('products') &&
			JSON.parse(localStorage.getItem('products'));
		if (items) {
			const uniqueIds = Object.keys(
				Object.values(items).reduce(
					(prev, { product }) => ({ ...prev, [product._id]: null }),
					{}
				)
			);
			axiosInstance.post('/products/cart', uniqueIds).then(res => {
				const products = res.data.reduce(
					(prev, curr) => ({ ...prev, [curr._id]: curr }),
					{}
				);
				Object.values(items).forEach(
					item => (item.product = products[item.product._id])
				);
				loadCart(items);
			});
		}
	});

	return (
		<BrowserRouter>
			<Navbar />
			<Route component={Home} path='/' exact></Route>
			<Route component={AdminDashboard} path='/admin' exact></Route>
			<Route component={CreateProduct} path='/create-product' exact></Route>
			<Route component={CreateCategory} path='/create-category' exact></Route>
			<Route component={AdminProducts} path='/admin/products' exact></Route>
			<Route
				component={UpdateProduct}
				path='/update-product/:productId'
				exact
			></Route>
			<Route
				component={UpdateCategory}
				path='/update-category/:categoryId'
				exact
			></Route>
			<Route component={ListProducts} path='/products' exact></Route>
			<Route component={SingleProduct} path='/product/:productId' exact></Route>
			<Route component={Cart} path='/cart' exact></Route>
			<Route component={CheckOut} path='/checkout' exact></Route>
			<Route component={OrderPlaced} path='/orderPlaced/:orderId' exact></Route>
		</BrowserRouter>
	);
}

export default connect(null, { loadCart })(App);
