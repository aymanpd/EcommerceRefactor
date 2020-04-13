import { v4 } from 'uuid';

export const addItem = item => ({ type: 'ADD_ITEM', payload: item });
export const modifyItem = (itemId, changes) => ({
	type: 'MODIFY_ITEM',
	payload: { itemId, changes }
});
export const deleteItem = itemId => ({ type: 'DELETE_ITEM', payload: itemId });
export const loadCart = items => ({ type: 'LOAD_CART', payload: items });
export const clearCart = () => ({ type: 'CLEAR_CART' });

export default (prev = {}, { type, payload }) => {
	switch (type) {
		case 'ADD_ITEM': {
			let nextState;
			const { product, props } = payload;
			const itemExists = Object.values(prev).find(
				item =>
					item.product._id === product._id &&
					item.props.color === props.color &&
					item.props.size === props.size
			);
			if (itemExists) {
				nextState = {
					...prev,
					[itemExists.id]: {
						id: itemExists.id,
						product,
						props: { ...props, qty: itemExists.props.qty + props.qty }
					}
				};
			} else {
				const id = v4();
				nextState = { ...prev, [id]: { id, product, props } };
			}
			localStorage.setItem('products', JSON.stringify(nextState));
			return nextState;
		}
		case 'MODIFY_ITEM': {
			let nextState;
			const item = prev[payload.itemId];
			nextState = {
				...prev,
				[payload.itemId]: {
					...item,
					props: { ...item.props, ...payload.changes }
				}
			};
			console.log(nextState[payload.itemId]);
			localStorage.setItem('products', JSON.stringify(nextState));
			return nextState;
		}
		case 'DELETE_ITEM':
			const { [payload]: deleted, ...rest } = prev;
			localStorage.setItem('products', JSON.stringify(rest));
			console.log(payload);
			return rest;

		case 'LOAD_CART':
			localStorage.setItem('products', JSON.stringify(payload));
			return payload;
		case 'CLEAR_CART':
			localStorage.setItem('products', '');
			return {};
		default:
			return prev;
	}
};
