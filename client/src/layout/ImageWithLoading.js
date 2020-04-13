import React, { useState, useEffect, useRef } from 'react';
import { CircularProgress, Box } from '@material-ui/core';

const ImageWithLoading = (props) => {
	const [loading, setLoading] = useState(true);
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		}
		setLoading(true);
	}, [props.src]);

	return (
		<>
			{loading && (
				<Box
					style={{
						position: 'absolute',
						top: '50%',
						textAlign: 'center',
						width: '100%',
						transform: 'translateY(-50%)',
					}}
				>
					<CircularProgress color='secondary' size={24} />
				</Box>
			)}
			<img
				style={loading ? { display: 'none' } : {}}
				{...props}
				onLoad={() => setLoading(false)}
			/>
		</>
	);
};

export default ImageWithLoading;
