import React, { useMemo, useState, useEffect } from 'react';
import useFetch from '../../utils/useFetch';
import ReactImageMagnify from 'react-image-magnify';
import QuantityInput from './QuantityInput';

import {
	Breadcrumbs,
	Box,
	Container,
	Grid,
	Select,
	MenuItem,
	FormControl,
	withStyles,
	CircularProgress
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import styles from './SingleProduct.module.scss';
import { connect } from 'react-redux';
import { addItem } from '../../components/cart/cartReducer';
import { Alert } from '@material-ui/lab';

export const StyledFormControl = withStyles({
	root: {
		display: 'inline-block',
		minWidth: 120,
		'& .MuiSelect-root': {},
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: '#000'
		}
	}
})(FormControl);

const SingleProduct = ({ match, addItem, history }) => {
	const requestConfig = useMemo(
		() => ({
			url: `/products/single/${match.params.productId}`,
			method: 'get'
		}),
		[match.params.productId]
	);
	const { loading, errored, data: { product, imagesBaseUrl } = {} } = useFetch(
		requestConfig
	);

	const ready = product && product._id;
	const [activeColor, setActiveColor] = useState();
	const [item, setItem] = useState();

	useEffect(() => {
		if (ready) {
			const firstColor = product.colors[0];
			setActiveColor({
				...firstColor,
				activeImage: firstColor.primaryImage
			});
			setItem({
				qty: 1,
				size: firstColor.sizes[0],
				color: firstColor.colorName
			});
		}
		//eslint-disable-next-line
	}, [ready]);

	useEffect(() => {
		errored && setTimeout(() => history.push('/'), 3000);
	}, [errored, history]);

	return (
		<Container>
			{loading && (
				<Box textAlign='center' mt='2rem' mb='2rem'>
					<CircularProgress color='secondary' size={24} />
				</Box>
			)}
			{errored && (
				<Box mt='2rem'>
					<Alert severity='error'>
						Category Was Not found :( you will be redirected in 3 seconds
					</Alert>
				</Box>
			)}
			{product && !loading && activeColor && (
				<>
					<Breadcrumbs
						separator={<NavigateNextIcon fontSize='small' />}
						aria-label='breadcrumb'
						className={styles.breadcrumb}
					>
						<Link color='inherit' to='/'>
							Home
						</Link>
						<Link
							color='inherit'
							to={`/products?category=${product.category._id}`}
						>
							{product.category.name}
						</Link>
						<li>{product.name}</li>
					</Breadcrumbs>

					<Grid container spacing={6}>
						{/* Images */}
						<Grid item xs={12} sm={6}>
							<Box className={styles.activeImage}>
								<ReactImageMagnify
									{...{
										smallImage: {
											alt: '',
											isFluidWidth: true,
											src: `${imagesBaseUrl}${activeColor.activeImage}.jpeg`
										},
										largeImage: {
											src: `${imagesBaseUrl}${activeColor.activeImage}.jpeg`,
											width: 800,
											height: 1000
										},
										hoverDelayInMs: 100,
										fadeDurationInMs: 200,
										enlargedImagePosition: 'over'
									}}
								/>
							</Box>
							<Box className={styles.images}>
								{[
									activeColor.primaryImage,
									activeColor.secondaryImage,
									...(activeColor.gallery || [])
								].map(
									image =>
										image && (
											<Box
												onClick={e =>
													setActiveColor(activeColor => ({
														...activeColor,
														activeImage: image
													}))
												}
												className={`${styles.imageContainer} ${
													activeColor.activeImage === image
														? styles.selectedImage
														: ''
												}`}
												key={image}
											>
												<img
													alt='single'
													src={`${imagesBaseUrl}${image}.jpeg`}
												/>
											</Box>
										)
								)}
							</Box>
						</Grid>

						{/* Details */}
						<Grid item xs={12} sm={6}>
							<h2 className={styles.productName}>{product.name}</h2>
							<Box>
								{product.onSale ? (
									<Box className={styles.onSalePriceBox}>
										<h5>
											<AttachMoneyIcon
												style={{ verticalAlign: 'text-top' }}
												fontSize='inherit'
											/>
											{product.regularPrice} USD
										</h5>
										<h4>
											<AttachMoneyIcon
												style={{ verticalAlign: 'text-top' }}
												fontSize='inherit'
											/>
											{product.salePrice} USD
										</h4>
									</Box>
								) : (
									<h4 className={styles.price}>
										<AttachMoneyIcon
											style={{ verticalAlign: 'text-top' }}
											fontSize='inherit'
										/>
										{product.regularPrice} USD
									</h4>
								)}
							</Box>
							<Box className={styles.propertyBlock}>
								<span className={styles.label}>Color</span>
								{console.log('re')}
								{product.colors.map(color => (
									<Box
										onClick={() => {
											setActiveColor({
												...color,
												activeImage: color.primaryImage
											});
											setItem(prevItem => ({
												qty: prevItem.qty,
												size: color.sizes[0],
												color: color.colorName
											}));
										}}
										key={color.colorName}
										className={`${styles.colorSelector} ${
											color._id === activeColor._id ? styles.activeColor : ''
										} `}
									>
										<Box bgcolor={color.colorName}></Box>
									</Box>
								))}
							</Box>
							<Box className={styles.propertyBlock}>
								<span className={styles.label}>Size</span>
								<StyledFormControl>
									<Select
										// onChange={e =>
										// 	setFilters({ ...filters, sort: e.target.value })
										// }
										// value={filters.sort}
										variant='outlined'
										fullWidth
										value={item.size}
										onChange={(_, { key }) => setItem({ ...item, size: key })}
									>
										{activeColor.sizes.map(size => (
											<MenuItem key={size} value={size}>
												{size.toUpperCase()}
											</MenuItem>
										))}
									</Select>
								</StyledFormControl>
							</Box>
							<Box className={styles.propertyBlock}>
								<span className={styles.label}>Qty</span>
								<QuantityInput
									value={item.qty}
									onChange={newValue => setItem({ ...item, qty: newValue })}
								/>
							</Box>
							<button
								onClick={() =>
									addItem({
										product: { ...product, imagesBaseUrl: imagesBaseUrl },
										props: item
									})
								}
								className={styles.addToCart}
							>
								<span style={{ display: 'block', transform: 'skew(15deg)' }}>
									Add to cart
								</span>
							</button>

							<p className={styles.description}>{product.description}</p>
							<ul className={styles.specs}>
								{product.specifications &&
									product.specifications.map(spec => (
										<li key={spec}>{spec}</li>
									))}
							</ul>
						</Grid>
					</Grid>
				</>
			)}
		</Container>
	);
};

export default connect(null, { addItem })(SingleProduct);
