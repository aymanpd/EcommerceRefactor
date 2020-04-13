import React from 'react';
//formik
import { FastField, Field } from 'formik';
//material-ui
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import {
	withStyles,
	FormControlLabel,
	Checkbox,
	InputLabel,
	FormControl,
	Select,
	MenuItem,
	CircularProgress,
	IconButton
} from '@material-ui/core';
import { CustomTextField } from './styledFields';

import PhotoCamera from '@material-ui/icons/PhotoCamera';
import MomentUtils from '@date-io/moment';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker
} from '@material-ui/pickers';
import { ChromePicker } from 'react-color';

//utils
import readFileAsync from '../../utils/readFileAsync';
import Alert from '@material-ui/lab/Alert';

const renderTextField = ({ name, text, required }, errors) => {
	return (
		<FastField key={name} name={name}>
			{({ field, form, meta }) => (
				<CustomTextField
					error={errors[field.name] && meta.touched}
					helperText={meta.touched && errors[field.name]}
					required={required}
					fullWidth
					{...field}
					label={text}
					variant='outlined'
				/>
			)}
		</FastField>
	);
};

/* Number Field */

/* Number Field */
const CustomNumberField = withStyles({
	root: {
		width: '30%',
		'& .Mui-focused': {
			color: '#000'
		},
		'& .MuiInputBase-root:after': {
			borderColor: '#000'
		}
	}
})(TextField);

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			thousandSeparator
			isNumericString
			prefix='$'
		/>
	);
}
NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};
const renderNumberField = ({ name, text, required }, errors) => {
	return (
		<FastField key={name} name={name}>
			{({ field, form, meta }) => (
				<CustomNumberField
					required={required}
					label={text}
					error={errors[field.name] && meta.touched}
					helperText={meta.touched && errors[field.name]}
					fullWidth
					InputProps={{
						inputComponent: NumberFormatCustom
					}}
					{...field}
					onChange={e => form.setFieldValue(field.name, e.target.value)}
				/>
			)}
		</FastField>
	);
};

/* Checkbox */
const renderCheckbox = ({ name, text, required }, errors) => {
	return (
		<FastField key={name} name={name}>
			{({ field, form, meta }) => (
				<FormControlLabel
					required={required}
					control={<Checkbox checked={field.value} {...field} />}
					label={text}
				/>
			)}
		</FastField>
	);
};

/* Date */
const CustomDatePicker = withStyles({
	root: {
		'& .MuiOutlinedInput-root': {
			'&:hover fieldset': {
				borderColor: '#000'
			},
			'&.Mui-focused fieldset': {
				borderColor: 'black'
			}
		}
	}
})(KeyboardDatePicker);

const renderDateField = ({ name, text, required }, errors) => {
	return (
		<FastField key={name} name={name}>
			{({ field, form, meta }) => (
				<MuiPickersUtilsProvider utils={MomentUtils}>
					<CustomDatePicker
						{...field}
						onChange={date => form.setFieldValue(field.name, date)}
						minDate={
							field.name === 'onSaleTo' && form.values.onSaleFrom
								? form.values.onSaleFrom
								: new Date()
						}
						format='DD/MM/YYYY'
						placeholder={text}
						inputVariant='outlined'
						variant='inline'
						fullWidth
						autoOk={true}
					/>
				</MuiPickersUtilsProvider>
			)}
		</FastField>
	);
};

/* Select Field */

const SelectFormControl = withStyles({
	root: {
		width: '100%'
	}
})(FormControl);

const renderSelect = ({ name, text, options, required }, errors) => {
	return (
		<FastField key={name} name={name}>
			{({ field, form, meta }) => (
				<SelectFormControl>
					<InputLabel id={name}>{text}</InputLabel>
					<Select labelId={name} required={required} {...field}>
						{options &&
							options.map(option => (
								<MenuItem key={option.value} value={option.value}>
									{option.text}
								</MenuItem>
							))}
					</Select>
				</SelectFormControl>
			)}
		</FastField>
	);
};

/* Async Select */
const CustomAsyncSelect = withStyles({
	root: {
		'& label.Mui-focused': {
			color: '#000'
		},
		label: {
			color: '#000'
		},
		'& .MuiOutlinedInput-root': {
			'&:hover fieldset': {
				borderColor: '#000'
			},
			'&.Mui-focused fieldset': {
				borderColor: 'black'
			}
		}
	}
})(Autocomplete);

const renderAutoComplete = (
	{ name, disabled, options, text, required },
	errors
) => (
	<FastField key={name} name={name}>
		{({ field, form, meta }) => (
			<Autocomplete
				disableClearable={true}
				disabled={disabled}
				{...field}
				options={options || []}
				onChange={(_, value) => {
					if (!value) {
						form.setFieldValue(form.setFieldValue(field.name, null));
					}
					form.setFieldValue(field.name, value);
				}}
				value={field.value}
				autoHighlight
				renderInput={params => (
					<CustomTextField
						{...params}
						label={text}
						variant='outlined'
						required={required}
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
	</FastField>
);

const renderAsyncSelect = (
	{ name, text, required },
	errors,
	categoriesResponse
) => {
	const options =
		categoriesResponse.categories &&
		categoriesResponse.categories.length > 0 &&
		categoriesResponse.categories.map(category => ({
			name: category.name,
			value: category._id
		}));
	return (
		<Field key={name} name={name}>
			{({ field, form, meta }) => (
				<CustomAsyncSelect
					style={{ width: 300 }}
					defaultValue={field.value}
					getOptionSelected={(option, value) => option.name === value.name}
					getOptionLabel={option => option.name}
					onChange={(e, newValue) =>
						form.setFieldValue(field.name, newValue ? newValue.value : null)
					}
					options={options || []}
					loading={categoriesResponse.loading}
					renderInput={params => (
						<TextField
							error={errors[field.name] && meta.touched}
							helperText={meta.touched && errors[field.name]}
							required
							{...params}
							label={text}
							variant='outlined'
							InputProps={{
								...params.InputProps,
								endAdornment: (
									<React.Fragment>
										{categoriesResponse.loading ? (
											<CircularProgress color='inherit' size={20} />
										) : null}
										{params.InputProps.endAdornment}
									</React.Fragment>
								)
							}}
						/>
					)}
				/>
			)}
		</Field>
	);
};

/* File input */

const renderFileField = (
	{ name, text, multiple = false, required },
	errors
) => {
	return (
		<FastField name={name} key={name}>
			{props => (
				<>
					<input
						required={required}
						onChange={e => handleFileChange(e.target.files, props)}
						accept='image/jpeg'
						style={{ display: 'none' }}
						id={name}
						type='file'
						multiple={multiple}
					/>
					<label htmlFor={name}>
						<IconButton
							color='secondary'
							aria-label='upload picture'
							component='span'
							style={{ fontSize: '1.2rem' }}
						>
							{text} <PhotoCamera style={{ marginLeft: '10px' }} />
						</IconButton>
					</label>
					{errors[name] && props.meta.touched && (
						<Alert severity='error'>{errors[name]}</Alert>
					)}
				</>
			)}
		</FastField>
	);
};

//Color field
const renderColorField = ({ name, text, required }, errors) => {
	return (
		<FastField name={name} key={name}>
			{props => (
				<ChromePicker
					color={props.field.value}
					onChange={({ hex }) => props.form.setFieldValue(name, hex)}
				/>
			)}
		</FastField>
	);
};

const handleFileChange = (files, { form, field }) => {
	Promise.all(
		Array.from(files).map(file => {
			return readFileAsync(file).then(fileBuffer => {
				return { buffer: fileBuffer };
			});
		})
	).then(values => {
		values.length > 1 || field.name.indexOf('gallery') !== -1
			? form.setFieldValue(field.name, values)
			: form.setFieldValue(field.name, values[0]);
	});
};

export default {
	text: renderTextField,
	number: renderNumberField,
	check: renderCheckbox,
	date: renderDateField,
	select: renderSelect,
	asyncSelect: renderAsyncSelect,
	color: renderColorField,
	file: renderFileField,
	autoComplete: renderAutoComplete
};
