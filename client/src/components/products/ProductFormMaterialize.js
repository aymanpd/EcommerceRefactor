import React, { useState, useEffect } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import * as Yup from 'yup';
import { Box, IconButton, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import LoadingButton from '../buttons/LoadingButton';
import fields from '../utils/fields';
import styles from './productForm.module.scss';
import Alert from '@material-ui/lab/Alert';
import CSS_COLORS from '../utils/CSS_COLORS';
import axiosInstance from '../../utils/axiosInstance';

const productSchema = Yup.object().shape({
	name: Yup.string().required('is required'),
	regularPrice: Yup.number().required('is required'),
	category: Yup.string().required('is required'),
	colors: Yup.array().of(
		Yup.object().shape({
			colorName: Yup.string().required('is required'),
			primaryImage: Yup.object().required(),
			secondaryImage: Yup.object().required(),
		})
	),
});

//name, type, placeholder, default value, options([ [value, label] ]), required
const basics = [
	{
		name: 'name',
		type: 'text',
		text: 'Name',
		defaultValue: '',
		required: true,
	},
	{ name: 'description', type: 'text', text: 'Description', defaultValue: '' },
	{
		name: 'regularPrice',
		type: 'number',
		text: 'Price',
		defaultValue: '',
		required: true,
	},
	{ name: 'featured', type: 'check', text: 'Featured', defaultValue: false },
	{
		name: 'stockStatus',
		type: 'select',
		text: 'Stock status',
		defaultValue: 'instock',
		options: [
			{ value: 'instock', text: 'In stock' },
			{ value: 'outofstock', text: 'Out of stock' },
		],
	},
	{
		name: 'onSaleFrom',
		type: 'date',
		text: 'sale Starts ',
		defaultValue: null,
	},
	{ name: 'onSaleTo', type: 'date', text: 'Sale ends', defaultValue: null },
	{
		name: 'salePrice',
		type: 'number',
		text: 'Price after sale',
		defaultValue: '',
	},

	{
		name: 'category',
		type: 'asyncSelect',
		text: 'Category',
		defaultValue: '',
		required: true,
	},
	// ['similarProducts', 'asyncSelect', 'Status', ""]
];

const basicsDefaultValues = basics.reduce(
	(prev, curr) => ({ ...prev, [curr.name]: curr.defaultValue }),
	{}
);
const defaultInitialValues = {
	...basicsDefaultValues,
	colors: [
		{
			colorName: null,
			sizes: { xs: false, s: false, m: false, l: false, xl: false },
			primaryImage: '',
			secondaryImage: '',
			gallery: [],
		},
	],
	specifications: [''],
};

const ProductFormMaterialize = ({
	imagesBaseUrl,
	initialValues = {},
	onSubmit,
	actionName,
}) => {
	//get categories
	const [categoriesResponse, setCategories] = useState({
		loading: false,
		categories: [],
	});
	useEffect(() => {
		(async () => {
			setCategories({ loading: true, categories: [] });
			const categories = await axiosInstance
				.get('/category')
				.then((res) => res.data.categories);
			setCategories({ categories, loading: false });
		})();
	}, []);
	return (
		<Formik
			initialValues={{ ...defaultInitialValues, ...initialValues }}
			validationSchema={productSchema}
			onSubmit={onSubmit}
		>
			{({ errors, isSubmitting, status, isValid }) => (
				<Form>
					<Box component='section' className={styles.section}>
						<h3 className={styles.sectionTitle}>Basics</h3>
						{basics.map((field) => {
							let extras;
							if (field.name === 'category') extras = categoriesResponse;
							return fields[field.type] ? (
								<Box width={'40%'} mb={'2rem'} key={field.name}>
									{fields[field.type](field, errors, extras)}
								</Box>
							) : (
								''
							);
						})}
					</Box>
					{/* Colors */}
					<FieldArray name='colors'>
						{({ form, push, errors, remove }) => (
							<Box component='section' className={styles.section}>
								<h3 className={styles.sectionTitle}>Colors</h3>
								{form.values.colors.map((color, index) => (
									// Color block
									<Box className={styles.colorBlock} key={index}>
										<button
											className={`${styles.deleteColor} ${
												form.values.colors.length === 1 && styles.disabled
											}`}
											disabled={form.values.colors.length === 1}
											onClick={(e) => {
												e.preventDefault();
												remove(index);
											}}
										>
											Remove Color
										</button>
										{/* Color Name */}
										<Box maxWidth={300}>
											{fields.autoComplete(
												{
													name: `colors[${index}].colorName`,
													text: `#${index + 1} Color name`,
													options: CSS_COLORS,
													required: true,
												},
												form.errors
											)}
										</Box>

										{/* Sizes */}
										{['xs', 's', 'm', 'l', 'xl'].map((size) =>
											fields.check(
												{
													name: `colors[${index}].sizes.${size}`,
													text: size.toUpperCase(),
												},
												form.errors
											)
										)}
										{/* Images */}
										{[
											{
												name: `colors[${index}].primaryImage`,
												text: 'Primary image',
											},
											{
												name: `colors[${index}].secondaryImage`,
												text: 'Secondary image',
											},
											{
												name: `colors[${index}].gallery`,
												text: 'Gallery',
												multiple: true,
											},
										].map((input) => fields.file(input, form.errors))}
										{/* Images Preview */}
										<Box display='flex' className={styles.imagePreview}>
											{/* primary and secondary preview */}
											{['primaryImage', 'secondaryImage'].map((image, key) => (
												<Box key={key} flexBasis={'50%'}>
													{color[image] && (
														<>
															<img
																alt={image}
																src={
																	color[image].buffer ||
																	(imagesBaseUrl &&
																		`${imagesBaseUrl}${color[image].url}.jpeg`)
																}
															/>
															<Button
																onClick={() =>
																	form.setFieldValue(
																		`colors[${index}].${image}`,
																		''
																	)
																}
																variant='outlined'
																color='secondary'
															>
																Remove image
															</Button>
														</>
													)}
												</Box>
											))}
										</Box>
										{form.errors.colors && form.errors.colors[index] && (
											<Alert
												style={{
													maxWidth: '450px',
													marginBottom: '.5rem',
												}}
												severity='info'
											>
												Each Color must have Name, primary and secondary image
											</Alert>
										)}
										{/* gallery preview */}
										{color.gallery && color.gallery.length > 0 && (
											<Box className={styles.gallery}>
												{color.gallery.map((image, galleryIndex) => (
													<Box
														className={styles.galleryImage}
														key={galleryIndex}
													>
														<img
															alt='gallery'
															src={
																image.buffer ||
																(imagesBaseUrl &&
																	`${imagesBaseUrl}${image.url}.jpeg`)
															}
														/>
														<Button
															onClick={() => {
																form.setFieldValue(
																	`colors[${index}].gallery`,
																	color.gallery.filter(
																		(_, imageIndex) =>
																			galleryIndex !== imageIndex
																	)
																);
															}}
															variant='outlined'
															color='secondary'
														>
															Remove image
														</Button>
													</Box>
												))}
											</Box>
										)}
									</Box>
								))}
								<IconButton
									onClick={(e) => {
										e.preventDefault();
										push(defaultInitialValues.colors[0]);
									}}
									aria-label='add'
								>
									<AddIcon />
								</IconButton>
							</Box>
						)}
					</FieldArray>
					{/* Specifications */}
					<FieldArray name='specifications'>
						{({ form, push, errors }) => (
							<Box component='section' className={styles.section}>
								<h3 className={styles.sectionTitle}>Specifications</h3>
								{form.values.specifications.map((specification, index) => (
									<Box mb={'2rem'} key={index}>
										{fields.text(
											{
												name: `specifications[${index}]`,
												text: `Spec #${index + 1}`,
											},
											form.errors
										)}
									</Box>
								))}
								<IconButton
									onClick={(e) => {
										e.preventDefault();
										push('');
									}}
									aria-label='add'
								>
									<AddIcon />
								</IconButton>
							</Box>
						)}
					</FieldArray>
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

export default ProductFormMaterialize;
