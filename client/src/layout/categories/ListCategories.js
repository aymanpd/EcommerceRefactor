import React from 'react';
import Categories from '../../components/categories/Categories';
import { Grid, Box } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import Alert from '@material-ui/lab/Alert';

const NUMBER_OF_SKELETONS = 6;
const ListCategories = ({ GirdComponent }) => {
	return (
		<Box mt={'2rem'}>
			<Categories>
				{({ loading, errored, data }) => (
					<>
						{errored && <Alert severity='error'>{console.log(errored)}</Alert>}{' '}
						{/* check */}
						{/* Loading Skeleton */}
						{loading && (
							<Grid container>
								{[...Array(NUMBER_OF_SKELETONS)].map((_, index) => (
									<Grid
										key={index}
										xs={12}
										sm={6}
										md={4}
										style={{ marginBottom: '1rem' }}
										item
									>
										<Skeleton
											style={{ transform: 'scale(1)' }}
											vairant='rect'
											animation='wave'
											width={'90%'}
											height={420}
										/>
									</Grid>
								))}
							</Grid>
						)}
						<Grid spacing={3} container>
							{data &&
								data.categories &&
								data.categories.map(category => (
									<GirdComponent
										key={category._id}
										category={category}
										imageBaseUrl={data.imageBaseUrl}
									/>
								))}
						</Grid>
					</>
				)}
			</Categories>
		</Box>
	);
};

export default ListCategories;
