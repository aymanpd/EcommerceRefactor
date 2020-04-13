import React from 'react';
import styles from './CartWidget.module.scss';
import { connect } from 'react-redux';
import { deleteItem } from './cartReducer';
import { Box, Grid } from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { Link } from 'react-router-dom';
import CloseIcon from '@material-ui/icons/Close';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

const CartWidget = ({ items, deleteItem }) => {
	return (
		<Box className={styles.widget}>
			{Object.values(items).map(({ id, props, product }) => (
				<Box key={id} className={styles.item}>
					<Grid spacing={3} container>
						<Grid style={{ position: 'relative' }} item xs={12} md={3}>
							<span className={styles.qty}>{props.qty}</span>
							<img
								className={styles.image}
								src={`${product.imagesBaseUrl}${
									product.colors.find(color => color.colorName === props.color)
										.primaryImage
								}.jpeg`}
								alt='item'
							/>
						</Grid>
						<Grid item xs={12} md={9}>
							<p className={styles.title}>
								<Link to={`/product/${product._id}`}>{product.name}</Link>
							</p>

							<Box className={styles.props}>
								<span>{`${props.size.toUpperCase()} / ${props.color}`}</span>
								{product.onSale ? (
									<Box className={styles.price}>
										<span>
											<AttachMoneyIcon
												style={{
													verticalAlign: 'text-top',
													fontSize: 'inherit'
												}}
											/>
											{product.salePrice * props.qty} USD
										</span>
										<span>
											<AttachMoneyIcon
												style={{
													verticalAlign: 'text-top',
													fontSize: 'inherit'
												}}
											/>
											{product.regularPrice * props.qty} USD
										</span>
									</Box>
								) : (
									<Box className={styles.price}>
										<span>
											<AttachMoneyIcon />
											{product.regularPrice * props.qty} USD
										</span>
									</Box>
								)}
							</Box>
							<span onClick={e => deleteItem(id)} className={styles.removeIcon}>
								<CloseIcon />
							</span>
						</Grid>
					</Grid>
				</Box>
			))}

			<p className={styles.cartFooter}>
				{Object.keys(items).length > 0 ? (
					<Link to='/cart'>
						View cart / Checkout <ArrowRightIcon />
					</Link>
				) : (
					'Your Cart Is Empty'
				)}

				<span className={styles.totalPrice}>
					Total:
					<AttachMoneyIcon />
					<span className={styles.price}>
						{Object.values(items).reduce(
							(prev, { props, product }) =>
								prev +
								(product.onSale ? product.salePrice : product.regularPrice) *
									props.qty,
							0
						)}
					</span>{' '}
					USD
				</span>
			</p>
		</Box>
	);
};

const mapStateToProps = ({ cart }) => ({
	items: cart
});

export default connect(mapStateToProps, { deleteItem })(CartWidget);
