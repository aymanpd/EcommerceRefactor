import { createStore, combineReducers, compose } from 'redux';
import cartReducer from './components/cart/cartReducer';

const store = createStore(
	combineReducers({
		cart: cartReducer
	}),
	compose(
		window.__REDUX_DEVTOOLS_EXTENSION__
			? window.__REDUX_DEVTOOLS_EXTENSION__()
			: f => f
	)
);

export default store;
