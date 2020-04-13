import React, { useState } from 'react';
import CheckOutForm from '../../components/checkout/CheckOutForm';
import {
	Container,
	Grid,
	Box,
	RadioGroup,
	Radio,
	FormControlLabel
} from '@material-ui/core';
import { CustomTextField } from '../../components/utils/styledFields';
import CartWidget from '../../components/cart/CartWidget';
import styles from './CheckOut.module.scss';
import { Alert } from '@material-ui/lab';
import { connect } from 'react-redux';
import { clearCart } from '../../components/cart/cartReducer';
import axiosInstance from '../../utils/axiosInstance';

const CheckOut = ({ items, history, clearCart }) => {
	const [paymentMethod, setPaymentMethod] = useState('stripe');
	const [orderNote, setOrderNote] = useState('');

	const onSubmit = (values, formControls) => {
		const lineItems = Object.values(items).map(({ id, product, props }) => ({
			...props,
			productId: product._id
		}));
		if (paymentMethod === 'cod') {
			axiosInstance
				.post('order/place-order', {
					lineItems,
					shippingAddress: values,
					orderNote
				})
				.then(res => {
					formControls.setStatus('succeeded');
					formControls.setSubmitting(false);
					clearCart();
					history.push(`/order-placed/${res.data._id}`);
				})
				.catch(e => {
					formControls.setFieldError('backend', e.response.data);
					formControls.setStatus('failed');
					formControls.setSubmitting(false);
				});
		} else {
			axiosInstance
				.post('order/checkout-session', {
					lineItems,
					orderNote,
					email: values.email,
					phone: values.phone
				})
				.then(res => {
					const stripe = window.Stripe(
						'pk_test_liP39EnnPqrLlOZh1MFg488D00Q1RuLIzl'
					);
					stripe.redirectToCheckout({
						sessionId: res.data.id
					});
				});
		}
	};

	return (
		<Container>
			{items && Object.keys(items).length ? (
				<Grid spacing={3} container>
					<Grid item xs={12} sm={6}>
						<Box className={styles.payment}>
							<h4>Payment Method</h4>
							<RadioGroup
								style={{ alignItems: 'flex-start' }}
								value={paymentMethod}
								onChange={(_, value) => setPaymentMethod(value)}
							>
								<FormControlLabel
									labelPlacement='start'
									value='stripe'
									label='Credit Card'
									control={<Radio size='small' />}
								/>
								<FormControlLabel
									labelPlacement='start'
									value='cod'
									label='Cash On Delivery'
									control={<Radio size='small' />}
								/>
							</RadioGroup>
						</Box>

						<CheckOutForm
							actionName={`${
								paymentMethod === 'cod' ? 'Place order' : 'Continue to payment'
							}`}
							paymentMethod={paymentMethod}
							onSubmit={onSubmit}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<CartWidget />
						<CustomTextField
							label='Order Note'
							multiline
							rowsMax='4'
							value={orderNote}
							onChange={e => setOrderNote(e.target.value)}
							variant='outlined'
							fullWidth
							style={{ marginTop: '1rem' }}
						/>
					</Grid>
				</Grid>
			) : (
				<Alert style={{ marginTop: '1rem' }} severity='info'>
					Your cart is empty
				</Alert>
			)}
		</Container>
	);
};

const mapStateToProps = ({ cart }) => ({ items: cart });
export default connect(mapStateToProps, { clearCart })(CheckOut);
