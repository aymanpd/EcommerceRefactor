import React from 'react'
import { Box, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './SingleProductAdmin.module.scss';

const SingleProductAdmin = ({ product }) => {
    return (
        <Link to={`/update-product/${product._id}`} className={styles.productLink}>
            <Grid className={styles.product} container>
                <Grid item xs={3}>
                    <Box className={styles.productImage}>
                        <img src={`${product.imagesBaseUrl}${product.colors[0].primaryImage}.jpeg`} alt='primary' />
                    </Box>
                </Grid>
                <Grid item xs={9}>
                    <h2 className={styles.productName}>{product.name}</h2>
                </Grid>
            </Grid>
        </Link>
    )
}

export default SingleProductAdmin
