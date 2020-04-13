import React, { useMemo, useEffect } from 'react';
import useFetch from '../../utils/useFetch';
import { Box, Button, CircularProgress } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import styles from './OrderPlaced.module.scss';
import Alert from '@material-ui/lab/Alert';

const OrderPlaced = ({ match, history }) => {
	const requestConfig = useMemo(
		() => ({
			url: `/order/${match.params.orderId}`
		}),
		[match.params.orderId]
	);

	const { loading, data, errored } = useFetch(requestConfig);

	useEffect(() => {
		errored && setTimeout(() => history.push('/admin'), 3000);
	}, [errored, history]);

	return (
		<Box>
			{loading && <CircularProgress color='secondary' size={24} />}

			{errored && (
				<Box mt='2rem'>
					<Alert severity='error'>
						Product Was Not found :( you will be redirected in 3 seconds
					</Alert>
				</Box>
			)}
			{data && (
				<Box className={styles.order}>
					<Box className={styles.icon}>
						<CheckCircleIcon />
					</Box>
					<p className={styles.successMessage}>
						Order Has Been Placed successfully
					</p>
					<ul>
						<li>
							Your Order Id: <span className={styles.orderId}>{data._id} </span>
							<span className={styles.note}>
								Please keep the order id to track your order
							</span>
						</li>
						<li>
							Have Any Question:{' '}
							<Button color='secondary' className={styles.contactUs}>
								Contact Us
							</Button>
						</li>
					</ul>
				</Box>
			)}
		</Box>
	);
};

export default OrderPlaced;
