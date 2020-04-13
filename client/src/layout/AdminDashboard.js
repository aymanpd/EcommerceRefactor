import React, { useState } from 'react';
import { Paper, Tab, Tabs, Container } from '@material-ui/core';
import { ShoppingCart } from '@material-ui/icons';
import styles from './AdminDashboard.module.scss';
import AdminProducts from './products/AdminProducts';
import AdminCategories from './categories/AdminCategories';

const TabPanel = ({ children, activeTab, value }) => {
	return activeTab === value ? children : null;
};

const AdminDashboard = () => {
	const [tab, setTab] = useState('products');
	const handleChange = (event, newTab) => {
		setTab(newTab);
	};
	return (
		<Container>
			<Paper className={styles.nav} square>
				<Tabs
					value={tab}
					onChange={handleChange}
					variant='fullWidth'
					indicatorColor='secondary'
					textColor='secondary'
					aria-label='icon label tabs example'
				>
					<Tab value='products' icon={<ShoppingCart />} label='Products' />
					<Tab value='categories' label='Categories' />
				</Tabs>
			</Paper>

			<TabPanel value='products' activeTab={tab}>
				<AdminProducts />
			</TabPanel>
			<TabPanel value='categories' activeTab={tab}>
				<AdminCategories />
			</TabPanel>
		</Container>
	);
};

export default AdminDashboard;
