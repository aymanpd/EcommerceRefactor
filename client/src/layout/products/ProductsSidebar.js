import React, { useState, useMemo, useEffect } from 'react';
import useFetch from '../../utils/useFetch';
import {
	List,
	ListItem,
	ListItemText,
	Collapse,
	CircularProgress,
	Checkbox,
	Slider,
	Box
} from '@material-ui/core';
import { NavLink } from 'react-router-dom/cjs/react-router-dom.min';
import styles from './ProductsSidebar.module.scss';

const ProductsSidebar = ({
	lowestPrice,
	highestPrice,
	params = {},
	setParams,
	colors,
	productNumber
}) => {
	const [priceRange, setPriceRange] = useState({});

	useEffect(() => {
		setPriceRange({});
	}, [highestPrice, lowestPrice]);

	const requestConfig = useMemo(
		() => ({
			url: 'category'
		}),
		[]
	);
	// get categories

	const { loading, data } = useFetch(requestConfig);
	// tabs
	const handleToggle = tab => {
		setToggle(prevState => ({ ...toggle, [tab]: !prevState[tab] }));
	};
	const [toggle, setToggle] = useState({
		categories: true,
		sizes: true,
		colors: false,
		range: true
	});

	// params
	const handleChange = (e, param) => {
		params[param] && params[param].includes(e.target.value)
			? setParams({
					...params,
					[param]: params[param].filter(item => item !== e.target.value)
			  })
			: setParams({
					...params,
					[param]: params[param]
						? [...params[param], e.target.value]
						: [e.target.value]
			  });
	};

	const handlePriceRange = (_, [minPrice, maxPrice]) => {
		setPriceRange({ minPrice, maxPrice });
	};

	return (
		<List component='nav' aria-labelledby='nested-list-subheader'>
			{/* Cateogries */}
			<ListItem button onClick={() => handleToggle('categories')}>
				<ListItemText className={styles.sectionTitle} primary='Categories' />
				{loading && (
					<CircularProgress
						style={{ width: '20px', height: '20px' }}
						color='secondary'
					/>
				)}
			</ListItem>
			<Collapse in={toggle.categories} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					{data &&
						data.categories &&
						data.categories.map(category => (
							<ListItem key={category._id}>
								<NavLink
									isActive={(_, location) =>
										location.search.indexOf(`category=${category._id}`) !== -1
									}
									activeStyle={{ color: '#fe5269' }}
									className={styles.categoryLink}
									to={`?category=${category._id}`}
								>
									{category.name}
								</NavLink>
							</ListItem>
						))}
				</List>
			</Collapse>

			{/* Sizes */}
			<ListItem button onClick={() => handleToggle('sizes')}>
				<ListItemText className={styles.sectionTitle} primary='Sizes' />
			</ListItem>
			<Collapse in={toggle.sizes} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					{['xs', 's', 'm', 'l', 'xl'].map(size => (
						<ListItem key={size}>
							<ListItemText
								primary={
									<label className={styles.label} htmlFor={size}>
										{size.toUpperCase()}
									</label>
								}
							/>
							<Checkbox
								onChange={e => handleChange(e, 'sizes')}
								value={size}
								checked={!!params.sizes && !!params.sizes.includes(size)}
								color='secondary'
								id={size}
							/>
						</ListItem>
					))}
				</List>
			</Collapse>

			{/* colors */}
			<ListItem button onClick={() => handleToggle('colors')}>
				<ListItemText className={styles.sectionTitle} primary='Colors' />
			</ListItem>
			<Collapse in={toggle.colors} timeout='auto' unmountOnExit>
				<List component='div' disablePadding>
					{colors &&
						colors.map(color => (
							<ListItem key={color}>
								<ListItemText
									primary={
										<label className={styles.label} htmlFor={color}>
											{color}
										</label>
									}
								/>
								<Checkbox
									onChange={e => handleChange(e, 'colors')}
									value={color}
									color='secondary'
									id={color}
									checked={!!params.colors && !!params.colors.includes(color)}
								/>
							</ListItem>
						))}
				</List>
			</Collapse>
			{/* Price Range */}
			{productNumber > 2 && (
				<>
					<ListItem button onClick={() => handleToggle('range')}>
						<ListItemText className={styles.sectionTitle} primary='Price' />
					</ListItem>
					<Collapse in={toggle.range} timeout='auto' unmountOnExit>
						<List component='div' disablePadding>
							<Box width='90%' margin='auto'>
								<Slider
									min={lowestPrice}
									max={highestPrice}
									value={[
										priceRange.minPrice || lowestPrice,
										priceRange.maxPrice || highestPrice
									]}
									step={15}
									onChange={handlePriceRange}
									onChangeCommitted={() =>
										setParams({
											...params,
											minPrice: priceRange.minPrice,
											maxPrice: priceRange.maxPrice
										})
									}
									valueLabelDisplay='auto'
									aria-labelledby='range-slider'
									// getAriaValueText={valuetext}
									color='secondary'
								/>
							</Box>
						</List>
					</Collapse>
				</>
			)}
		</List>
	);
};

export default ProductsSidebar;
