import React, { useMemo, useEffect } from 'react';
import { Box, Container, CircularProgress } from '@material-ui/core';
import useFetch from '../../utils/useFetch';

import ProductFormMaterialize from '../../components/products/ProductFormMaterialize';
import axiosInstance from '../../utils/axiosInstance';
import Alert from '@material-ui/lab/Alert';

const onSubmit = async (values, formControls) => {
	const productColors = values.colors.map(color => {
		const sizesArray = Object.keys(color.sizes).filter(
			size => color.sizes[size]
		);
		return { ...color, sizes: sizesArray };
	});

	const productValues = {
		...values,
		category: values.category.value ? values.category.value : values.category,
		colors: productColors
	};

	axiosInstance
		.patch(`/products/${values._id}/update`, productValues)
		.then(res => {
			formControls.setStatus('succeeded');
			formControls.setSubmitting(false);
		})
		.catch(e => {
			formControls.setFieldError('backend', e.response && e.response.data);
			formControls.setStatus('failed');
			formControls.setSubmitting(false);
		});
};

const convertData = ({ product }) => {
	const colors = product.colors.map(color => ({
		...color,
		sizes: ['xs', 's', 'm', 'l', 'xl'].reduce(
			(prev, curr) => ({ ...prev, [curr]: color.sizes.includes(curr) }),
			{}
		),
		primaryImage: { url: color.primaryImage },
		secondaryImage: { url: color.secondaryImage },
		gallery: color.gallery ? color.gallery.map(url => ({ url })) : []
	}));
	return {
		...product,
		category: { name: product.category.name, value: product.category._id },
		colors
	};
};
const UpdateProduct = ({ match, history }) => {
	const requestConfig = useMemo(
		() => ({
			url: `/products/single/${match.params.productId}`,
			method: 'get'
		}),
		[match.params.productId]
	);
	const { loading, errored, data } = useFetch(requestConfig);

	useEffect(() => {
		errored && setTimeout(() => history.push('/admin'), 3000);
	}, [errored, history]);

	return (
		<Box>
			<Container fixed>
				{loading && <CircularProgress color='secondary' size={24} />}

				{errored && (
					<Box mt='2rem'>
						<Alert severity='error'>
							Product Was Not found :( you will be redirected in 3 seconds
						</Alert>
					</Box>
				)}

				{data && (
					<ProductFormMaterialize
						imagesBaseUrl={data.imagesBaseUrl}
						initialValues={convertData(data)}
						onSubmit={onSubmit}
						actionName='Update Product'
					/>
				)}
			</Container>
		</Box>
	);
};

export default UpdateProduct;
