import React from 'react';
import CategoryForm from '../../components/categories/CategoryForm';
import axiosInstance from '../../utils/axiosInstance';
import { Container, Box } from '@material-ui/core';

const onSubmit = (values, formControls) => {
	axiosInstance
		.post('/category', values)
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

const CreateCategory = () => {
	return (
		<Container>
			<Box mt={'2rem'}>
				<CategoryForm onSubmit={onSubmit} />
			</Box>
		</Container>
	);
};

export default CreateCategory;
