import React from 'react';
import SingleCategoryIndex from './categories/SingleCategoryIndex';
import ListCateogories from './categories/ListCategories';
import { Container } from '@material-ui/core';

const Home = () => {
	return (
		<Container>
			<ListCateogories GirdComponent={SingleCategoryIndex} />;
		</Container>
	);
};

export default Home;
