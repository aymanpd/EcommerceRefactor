import { connect } from 'react-redux';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Container, Box, Grid } from '@material-ui/core';
import styles from './Cart.module.scss';
import { Link } from 'react-router-dom';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { modifyItem, deleteItem } from '../../components/cart/cartReducer';
import GoBack from '../../components/utils/GoBack';
import { Alert } from '@material-ui/lab';
import QuantityInput from '../products/QuantityInput';

const Cart = ({ items, modifyItem, deleteItem, history }) => {
	return (
		<Container>
			{items && Object.keys(items).length ? (
				<>
					<TableContainer>
						<Table className={styles.table}>
							<TableHead>
								<TableRow>
									<TableCell>Item</TableCell>
									<TableCell align='center'>Color</TableCell>
									<TableCell align='center'>Size</TableCell>
									<TableCell align='center'>Quantity</TableCell>
									<TableCell align='center'>Price</TableCell>
									<TableCell align='center'></TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{Object.values(items).map(({ id, product, props }) => (
									<TableRow key={id}>
										<TableCell className={styles.itemCell}>
											<Grid spacing={2} container className={styles.item}>
												<Grid item xs={12} sm={6}>
													<img
														src={`${product.imagesBaseUrl}${
															product.colors.find(
																color => color.colorName === props.color
															).primaryImage
														}.jpeg`}
														alt='primary'
													/>
												</Grid>
												<Grid
													style={{ alignSelf: 'center' }}
													item
													xs={12}
													sm={6}
												>
													<Link to={`/product/${product._id}`}>
														<h4>{product.name}</h4>
													</Link>
												</Grid>
											</Grid>
										</TableCell>
										<TableCell align='center'>{props.color}</TableCell>
										<TableCell align='center'>
											{props.size.toUpperCase()}
										</TableCell>
										<TableCell align='center'>
											<QuantityInput
												value={props.qty}
												onChange={newValue => modifyItem(id, { qty: newValue })}
											/>
										</TableCell>
										<TableCell className={styles.price} align='center'>
											<AttachMoneyIcon
												style={{
													verticalAlign: 'text-top',
													fontSize: 'inherit'
												}}
											/>
											{(product.onSale
												? product.salePrice
												: product.regularPrice) * props.qty}{' '}
											USD
										</TableCell>
										<TableCell align='center'>
											<button
												onClick={() => deleteItem(id)}
												className={styles.removeItem}
											>
												Remove
											</button>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</TableContainer>
					<Box display='flex'>
						<Box flexGrow={1}>
							<GoBack />
						</Box>
						<Box>
							<p className={styles.subtotal}>
								Subtotal:{' '}
								<span>
									<AttachMoneyIcon
										style={{
											verticalAlign: 'middle',
											fontSize: 'inherit'
										}}
									/>
									{Object.values(items).reduce((prev, { product, props }) => {
										const price =
											(product.onSale
												? product.salePrice
												: product.regularPrice) * props.qty;
										return prev + price;
									}, 0)}{' '}
									USD
								</span>
							</p>
							<Link to='/checkout' className={styles.checkout}>
								Check Out
							</Link>
						</Box>
					</Box>
				</>
			) : (
				<Alert style={{ marginTop: '1rem' }} severity='info'>
					Your cart is empty
				</Alert>
			)}
		</Container>
	);
};

const mapStateToProps = ({ cart }) => ({ items: cart });
export default connect(mapStateToProps, { modifyItem, deleteItem })(Cart);
