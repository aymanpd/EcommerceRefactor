import React from 'react';
import { Formik, Form } from 'formik';
import fields from '../utils/fields';
import { Box } from '@material-ui/core';
import styles from './CategoryForm.module.scss';
import Alert from '@material-ui/lab/Alert';
import LoadingButton from '../buttons/LoadingButton';
import * as Yup from 'yup';

const categorySchema = Yup.object().shape({
	name: Yup.string().required('is required'),
	image: Yup.object().required('category image is required')
});

const defaultValues = {
	name: '',
	description: '',
	image: ''
};

const CategoryForm = ({
	imageBaseUrl,
	initialValues = defaultValues,
	actionName = 'Add Category',
	onSubmit = console.log
}) => {
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={categorySchema}
		>
			{({ errors, isSubmitting, status, isValid, values: { image } }) => (
				<Form>
					<Box className={styles.formGroup}>
						{fields.text(
							{ name: 'name', text: 'Name', required: true },
							errors
						)}
					</Box>
					<Box className={styles.formGroup}>
						{fields.text({ name: 'description', text: 'Description' }, errors)}
					</Box>
					<Box className={styles.formGroup}>
						{fields.file({ name: 'image', text: 'Category Image' }, errors)}
					</Box>
					<Box className={styles.imagePreview}>
						{image && (
							<img
								alt='category'
								src={image.buffer || `${imageBaseUrl}${image.url}.jpeg`}
							/>
						)}
					</Box>
					<Box textAlign='center'>
						{errors.backend && <Alert severity='error'>{errors.backend}</Alert>}
						<LoadingButton
							loading={isSubmitting}
							success={status === 'succeeded' && isValid && !isSubmitting}
							variant='outlined'
							color='primary'
							type='submit'
						>
							{actionName}
						</LoadingButton>
					</Box>
				</Form>
			)}
		</Formik>
	);
};

export default CategoryForm;
