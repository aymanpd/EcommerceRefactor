import React from 'react';
import { Box, Container } from '@material-ui/core';
import ProductFormMaterialize from '../../components/products/ProductFormMaterialize';
import axiosInstance from '../../utils/axiosInstance';

const onSubmit = async (values, formControls) => {
	// convert sizes object to array
	const productColors = values.colors.map(color => {
		const sizesArray = Object.keys(color.sizes).filter(
			size => color.sizes[size]
		);
		return { ...color, sizes: sizesArray };
	});

	const productValues = { ...values, colors: productColors };

	await axiosInstance
		.post('/products/create', productValues)
		.then(res => {
			formControls.setStatus('succeeded');
			formControls.setSubmitting(false);
		})
		.catch(e => {
			formControls.setFieldError('backend', e.response.data);
			formControls.setStatus('failed');
			formControls.setSubmitting(false);
		});
};

const CreateProduct = () => {
	return (
		<Box mt='2rem'>
			<Container fixed>
				<ProductFormMaterialize onSubmit={onSubmit} actionName='Add Product' />
			</Container>
		</Box>
	);
};

export default CreateProduct;
