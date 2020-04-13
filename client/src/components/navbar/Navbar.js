import React from 'react';
import styles from './Navbar.module.scss';
import { Box, Container } from '@material-ui/core';
import { Link, NavLink, withRouter } from 'react-router-dom';
import SearchIcon from '@material-ui/icons/Search';
import LocalMallIcon from '@material-ui/icons/LocalMall';
import { useState } from 'react';
import CartWidget from '../cart/CartWidget';
import { useEffect } from 'react';
import { connect } from 'react-redux';

const cartWidgetAllowed = pathname =>
	!['/cart', '/checkout'].includes(pathname);

const Navbar = ({ location, items, history }) => {
	const [activeWidget, setActiveWidget] = useState();
	useEffect(() => {
		!cartWidgetAllowed(location.pathname) &&
			activeWidget === 'cart' &&
			setActiveWidget();
		// eslint-disable-next-line
	}, [location.pathname]);
	useEffect(() => {
		cartWidgetAllowed(location.pathname) &&
			Object.values(items).length > 0 &&
			setActiveWidget('cart');
		Object.values(items).length === 0 && setActiveWidget('');
		// eslint-disable-next-line
	}, [items]);
	return (
		<Box className={styles.nav} component='nav'>
			<Box
				className={`${styles.searchWidget} ${
					activeWidget === 'search' ? styles.active : ''
				}`}
			>
				<form
					className={styles.searchForm}
					onSubmit={e => {
						e.preventDefault();
						e.target.search.value &&
							history.push('/products?search=' + e.target.search.value);
					}}
				>
					<input
						// onChange={e => modifySearchText(e.target.value)}
						placeholder='Type your search ..'
						type='text'
						className='search-widget__input'
						name='search'
					/>
					<button type='submit'>
						<SearchIcon />
					</button>
				</form>
			</Box>
			<Box
				className={`${styles.cartWidget} ${
					activeWidget === 'cart' ? styles.active : ''
				}`}
			>
				<CartWidget />
			</Box>
			<Container>
				<Box className={styles.content}>
					<Link className={styles.brand} to='/'>
						<h1>Ecommerce</h1>
					</Link>
					<Box className={styles.links}>
						<NavLink exact activeClassName={styles.active} to='/'>
							Home
						</NavLink>
						<NavLink
							exact
							isActive={(_, location) =>
								location.search.indexOf(`featured=true`) !== -1
							}
							activeClassName={styles.active}
							to='/products?featured=true'
						>
							Featured
						</NavLink>
						<NavLink
							exact
							isActive={(_, location) =>
								location.search.indexOf('onSale=true') !== -1
							}
							activeClassName={styles.active}
							to='/products?onSale=true'
						>
							On sale
						</NavLink>
					</Box>
					<Box className={styles.icons}>
						<SearchIcon
							onClick={() =>
								activeWidget === 'search'
									? setActiveWidget()
									: setActiveWidget('search')
							}
							className={`${activeWidget === 'search' ? styles.active : ''}`}
						/>
						<Box
							onClick={() => {
								if (['/cart', '/checkout'].includes(location.pathname)) return;
								activeWidget === 'cart'
									? setActiveWidget()
									: setActiveWidget('cart');
							}}
							className={styles.cartIcon}
						>
							<LocalMallIcon
								className={`${activeWidget === 'cart' ? styles.active : ''}`}
							/>
							{Object.keys(items).length > 0 && (
								<span>{Object.keys(items).length}</span>
							)}
						</Box>
					</Box>
				</Box>
			</Container>
		</Box>
	);
};

const mapStateToProps = ({ cart }) => ({ items: cart });

export default withRouter(connect(mapStateToProps)(Navbar));
