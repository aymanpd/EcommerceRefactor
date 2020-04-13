import useFetch from '../../utils/useFetch';

const requestConfig = {
	url: '/category'
};

const Categories = ({ children }) => {
	const { loading, errored, data } = useFetch(requestConfig);
	return children({ loading, errored, data });
};

export default Categories;
