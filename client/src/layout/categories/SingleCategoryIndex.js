import React from 'react';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './SingleCategoryAdmin.module.scss';

const SingleCategoryIndex = ({ category, imageBaseUrl }) => {
	return (
		<Grid xs={12} sm={6} md={4} item>
			<Link
				className={styles.product}
				to={'/products?category=' + category._id}
			>
				<h2 className={styles.title}>{category.name}</h2>
				<img src={`${imageBaseUrl}${category.image}.jpeg`} alt='category' />
			</Link>
		</Grid>
	);
};

export default SingleCategoryIndex;
