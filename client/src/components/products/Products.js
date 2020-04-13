import React, { useState, useMemo, useEffect, useRef } from 'react';
import useFetch from '../../utils/useFetch';

const Products = ({ children, initialParams = {}, query, page }) => {
	const [params, setParams] = useState(initialParams);
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			setParams(initialParams);
		}
		// eslint-disable-next-line
	}, [query]);

	const requestConfig = useMemo(
		() => ({
			url: '/products/all',
			params: { ...params, ...query, page },
		}),
		// eslint-disable-next-line
		[params, page]
	);
	const { loading, errored, data } = useFetch(requestConfig);
	return <div>{children({ loading, data, errored, params, setParams })}</div>;
};

export default Products;
