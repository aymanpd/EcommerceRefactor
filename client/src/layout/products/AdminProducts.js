import React, { useMemo, useState } from 'react';
import Products from '../../components/products/Products';
import {
	Container,
	CircularProgress,
	TextField,
	Box,
	FormControl,
	Select,
	MenuItem,
	withStyles,
	Grid
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SingleProductAdmin from './SingleProductAdmin';
import useFetch from '../../utils/useFetch';
import styles from './AdminProducts.module.scss';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Skeleton from '@material-ui/lab/Skeleton';

const filterProducts = (products, { category, sort }) => {
	let filteredProducts = products;
	if (category) {
		filteredProducts = filteredProducts.filter(
			product => category.value === product.category._id
		);
	}
	const [sortBy, sortOrder] = sort.split(':');
	return sortBy === 'date'
		? filteredProducts.sort(
				(a, b) => (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder
		  )
		: filteredProducts.sort(
				(a, b) => (a.regularPrice - b.regularPrice) * sortOrder
		  );
};

const StyledAsyncSelect = withStyles({
	root: {
		maxWidth: '300px',
		marginBottom: '2rem',
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

export const StyledFormControl = withStyles({
	root: {
		display: 'block',
		textAlign: 'right',
		marginBottom: '1rem',
		'& .MuiSelect-root': {},
		'& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
			borderColor: '#000'
		}
	}
})(FormControl);

const NUMBER_OF_SKELETONS = 4;

const AdminProducts = () => {
	const requestConfig = useMemo(
		() => ({
			url: '/category'
		}),
		[]
	);
	const { loading: categoriesLoading, data: categoriesResponse } = useFetch(
		requestConfig
	);
	const [filters, setFilters] = useState({
		category: undefined,
		sort: 'date:-1'
	});
	return (
		<Products>
			{({ params, setParams, loading, errored, data }) => {
				return (
					<Container fixed>
						{errored && <Alert severity='error'>{console.log(errored)}</Alert>}{' '}
						{/* check */}
						{/* Loading Skeleton */}
						{loading &&
							[...Array(NUMBER_OF_SKELETONS)].map((_, index) => (
								<Box
									mb={'2rem'}
									key={index}
									padding='15px'
									border='1px solid #DDD'
									display='flex'
								>
									<Box>
										<Skeleton
											vairant='rect'
											animation='wave'
											width={200}
											height={200}
											style={{ marginBottom: 6 }}
										/>
									</Box>
									<Box ml={'1rem'} mt={'50px'} flexGrow='1'>
										<Skeleton
											variant='text'
											animation='wave'
											width={'80%'}
											height={30}
											style={{ marginBottom: 6 }}
										/>
									</Box>
								</Box>
							))}
						{data && data.products && (
							<Box>
								<Grid container>
									{/* Category filter */}
									<Grid xs={6} item>
										<StyledAsyncSelect
											getOptionLabel={option => option.name}
											onChange={(e, newValue) => {
												setFilters({ ...filters, category: newValue });
											}}
											options={
												(categoriesResponse &&
													categoriesResponse.categories.map(category => ({
														name: category.name,
														value: category._id
													}))) ||
												[]
											}
											loading={categoriesLoading}
											renderInput={params => (
												<TextField
													{...params}
													variant='outlined'
													placeholder='All Categories'
													InputProps={{
														...params.InputProps,
														endAdornment: (
															<React.Fragment>
																{categoriesLoading ? (
																	<CircularProgress color='inherit' size={20} />
																) : null}
																{params.InputProps.endAdornment}
															</React.Fragment>
														)
													}}
												/>
											)}
										/>
									</Grid>
									{/* Sorting */}
									<Grid item xs={6}>
										<StyledFormControl>
											<Select
												onChange={e =>
													setFilters({ ...filters, sort: e.target.value })
												}
												value={filters.sort}
												variant='outlined'
											>
												<MenuItem value={'date:-1'}>Date, new to old</MenuItem>
												<MenuItem value={'date:1'}>Date, old to new</MenuItem>
												<MenuItem value={'price:1'}>
													Price, low to high
												</MenuItem>
												<MenuItem value={'price:-1'}>
													Price, high to low
												</MenuItem>
											</Select>
										</StyledFormControl>
									</Grid>
								</Grid>
								{/* Products */}
								<Box className={styles.products}>
									{filterProducts(data.products, filters).map(product => (
										<SingleProductAdmin key={product._id} product={product} />
									))}
								</Box>
							</Box>
						)}
					</Container>
				);
			}}
		</Products>
	);
};

export default AdminProducts;
