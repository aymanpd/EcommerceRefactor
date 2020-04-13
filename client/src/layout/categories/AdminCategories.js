import React from 'react';
import SingleCategoryAdmin from './SingleCategoryAdmin';
import ListCateogories from './ListCategories';

const AdminCategories = () => {
	return <ListCateogories GirdComponent={SingleCategoryAdmin} />;
};

export default AdminCategories;
