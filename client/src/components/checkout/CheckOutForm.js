import React from 'react';
import styles from './CheckOutForm.module.scss';
import { Box } from '@material-ui/core';
import { Formik, Form, Field } from 'formik';
import fields from '../utils/fields';
import { Autocomplete } from '@material-ui/lab';
import { CountryRegionData } from 'react-country-region-selector';
import GoBack from '../utils/GoBack';
import LoadingButton from '../buttons/LoadingButton';
import * as Yup from 'yup';
import { CustomTextField } from '../utils/styledFields';

const checkoutFields = [
	{ name: 'email', text: 'Email', value: '' },
	{ name: 'phone', text: 'Mobile Phone', value: '' },
	{ name: 'firstName', text: 'First Name', value: '' },
	{ name: 'lastName', text: 'Last Name', value: '' },
	{ name: 'address', text: 'Address', value: '' },
	{
		name: 'address 2',
		text: 'Apartment, Studio or flat',
		value: ''
	}
];

const countries = {};

CountryRegionData.forEach(country => {
	countries[country[0]] = country[2].split('|');
});

const shippingAddressSchema = paymentMethod => {
	let shippingAddress = {
		email: Yup.string()
			.email()
			.required('is required'),
		phone: Yup.number()
			.typeError('Phone must be a valid number')
			.required('is required')
	};
	if (paymentMethod === 'cod') {
		shippingAddress = {
			...shippingAddress,
			firstName: Yup.string().required('is required'),
			lastName: Yup.string().required('is required'),
			address: Yup.string().required('is required'),
			'address 2': Yup.string().required('is required'),
			country: Yup.string()
				.required('is required')
				.typeError('is required'),
			state: Yup.string()
				.required('is required')
				.typeError('is required')
		};
	}
	return Yup.object().shape(shippingAddress);
};

const CheckOutForm = ({
	actionName,
	paymentMethod,
	onSubmit,
	initialValues = {
		...checkoutFields.reduce(
			(prev, curr) => ({ ...prev, [curr.name]: curr.value }),
			{}
		),
		country: null,
		state: null
	}
}) => {
	return (
		<Formik
			initialValues={initialValues}
			onSubmit={onSubmit}
			validationSchema={shippingAddressSchema(paymentMethod)}
		>
			{({ errors, isSubmitting, status, isValid }) => (
				<Form>
					{(paymentMethod === 'cod'
						? checkoutFields
						: checkoutFields.slice(0, 2)
					).map(({ name, text }) => (
						<Box key={name} className={styles.formGroup}>
							{fields.text({ name, text, required: true }, errors)}
						</Box>
					))}
					{paymentMethod === 'cod' && (
						<Box className={styles.formGroup}>
							{['country', 'state'].map(input => (
								<Field key={input} name={input}>
									{({ field, form, meta }) => (
										<Autocomplete
											disabled={input === 'state' && !form.values.country}
											{...field}
											style={{
												width: '49%',
												marginRight: input === 'country' ? '1%' : 0,
												display: 'inline-block'
											}}
											options={
												input === 'country'
													? Object.keys(countries)
													: countries[form.values.country] || []
											}
											onChange={(_, value) => {
												if (!value) {
													form.setFieldValue(input, null);
												}
												form.setFieldValue(input, value);
												input === 'country' &&
													form.setFieldValue('state', null);
											}}
											value={field.value}
											autoHighlight
											renderInput={params => (
												<CustomTextField
													{...params}
													label={'Choose a ' + input}
													variant='outlined'
													required={true}
													inputProps={{
														...params.inputProps,
														autoComplete: 'new-password' // disable autocomplete and autofill
													}}
													error={errors[field.name] && meta.touched}
													helperText={meta.touched && errors[field.name]}
												/>
											)}
										/>
									)}
								</Field>
							))}
						</Box>
					)}
					<Box display='flex'>
						<GoBack />
						<Box flexGrow={1} textAlign='right'>
							<LoadingButton
								loading={isSubmitting}
								success={status === 'succeeded' && isValid && !isSubmitting}
								type='submit'
							>
								{actionName}
							</LoadingButton>
						</Box>
					</Box>
				</Form>
			)}
		</Formik>
	);
};

export default CheckOutForm;
