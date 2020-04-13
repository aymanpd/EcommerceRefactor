import React, { useState } from 'react';
import { Grid, Box } from '@material-ui/core';
import styles from './SingleProductGrid.module.scss';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import moment from 'moment';
import ImageWithLoading from '../ImageWithLoading';

const SingleProductGrid = ({ product }) => {
	const [activeColor, setActiveColor] = useState(0);
	return (
		<Grid item xs={12} md={4}>
			<Box className={styles.product}>
				<Link to={`/product/${product._id}`} className={styles.productLink}>
					<Box
						className={`${styles.images} ${
							product.onSale ? styles.onSale : ''
						}`}
					>
						<ImageWithLoading
							className={styles.primaryImage}
							alt='primary'
							src={`${product.imagesBaseUrl}${product.colors[activeColor].primaryImage}.jpeg`}
						/>
						<ImageWithLoading
							className={styles.secondaryImage}
							alt='secondary'
							src={`${product.imagesBaseUrl}${product.colors[activeColor].secondaryImage}.jpeg`}
						/>
					</Box>
					<Box>
						<h4 className={styles.name}>{product.name}</h4>
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
				</Link>
				<Box>
					{product.colors.map((color, index) => (
						<Box
							onClick={() => setActiveColor(index)}
							key={color.colorName}
							className={`${styles.colorSelector} ${
								index === activeColor ? styles.activeColor : ''
							}`}
						>
							<Box bgcolor={color.colorName}></Box>
						</Box>
					))}
				</Box>
				{product.onSale && (
					<h5 className={styles.saleDuration}>
						On sale for {moment(product.onSaleTo).diff(moment(), 'day')} day(s)
					</h5>
				)}
			</Box>
		</Grid>
	);
};

export default SingleProductGrid;
