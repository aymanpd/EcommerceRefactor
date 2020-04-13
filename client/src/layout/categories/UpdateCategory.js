import React, { useMemo, useEffect } from 'react';
import useFetch from '../../utils/useFetch';
import CategoryForm from '../../components/categories/CategoryForm';
import { Box, Container, CircularProgress } from '@material-ui/core';
import axiosInstance from '../../utils/axiosInstance';
import Alert from '@material-ui/lab/Alert';

const onSubmit = (values, formControls) => {
	axiosInstance
		.patch(`/category/${values._id}`, values)
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

const UpdateCategory = ({ match, history }) => {
	const requestConfig = useMemo(
		() => ({
			url: `category/${match.params.categoryId}`
		}),
		[match.params.categoryId]
	);

	const { loading, errored, data } = useFetch(requestConfig);
	useEffect(() => {
		errored && setTimeout(() => history.push('/admin'), 3000);
	}, [errored, history]);
	return (
		<Box mt='2rem'>
			<Container fixed>
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
				{data && (
					<CategoryForm
						actionName='Update'
						onSubmit={onSubmit}
						imageBaseUrl={data.imageBaseUrl}
						initialValues={{
							...data.category,
							image: { url: data.category.image }
						}}
					/>
				)}
			</Container>
		</Box>
	);
};

export default UpdateCategory;
