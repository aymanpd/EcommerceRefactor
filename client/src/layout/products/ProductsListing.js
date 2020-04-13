import React from 'react'
import { Grid } from '@material-ui/core'
import { StyledFormControl } from './AdminProducts'

const ProductsListing = () => {
    return (


								<Grid xs={12} md={10} item>
									<h3 style={{ marginTop: '2rem' }}>
										{data &&
											`${
												params.category && data.products.length > 0
													? data.products[0].category.name
													: ''
											} 
                                        ${data.productsCount} Item(s)`}
									</h3>
									<StyledFormControl>
										<Select
											onChange={e =>
												setParams({ ...params, sort: e.target.value })
											}
											value={params.sort || 'createdAt:desc'}
											variant='outlined'
										>
											<MenuItem value={'createdAt:desc'}>
												Date, new to old
											</MenuItem>
											<MenuItem value={'createdAt:asc'}>
												Date, old to new
											</MenuItem>
											<MenuItem value={'regularPrice:asc'}>
												Price, low to high
											</MenuItem>
											<MenuItem value={'regularPrice:desc'}>
												Price, high to low
											</MenuItem>
										</Select>
									</StyledFormControl>

									{/* Loading Skeleton */}
									{!data && loading && (
										<Grid container spacing={3}>
											{[...Array(NUMBER_OF_SKELETONS)].map((_, index) => (
												<Grid
													key={index}
													xs={12}
													md={4}
													style={{ marginBottom: '1rem' }}
													item
												>
													<Skeleton
														style={{
															transform: 'scale(1)',
															marginBottom: '1rem'
														}}
														vairant='rect'
														animation='wave'
														height={420}
													/>
													<Skeleton
														style={{
															transform: 'scale(1)',
															margin: '0 auto 1rem'
														}}
														vairant='rect'
														animation='wave'
														width={'90%'}
														height={10}
													/>
													<Skeleton
														style={{ transform: 'scale(1)', margin: 'auto' }}
														vairant='rect'
														animation='wave'
														width={'15%'}
														height={20}
													/>
												</Grid>
											))}
										</Grid>
									)}
									{/* No Products */}
									{data && !loading && data.products.length < 1 && (
										<h4 className={styles.noItems}>
											There are no items match your criteria
										</h4>
									)}

									{data && (
										<Grid container spacing={3}>
											{data.products.map(product => (
												<SingleProductGrid
													key={product._id}
													product={product}
												/>
											))}
										</Grid>
									)}
								</Grid>
							</Grid>
							{/* Pagination */}
							{data && (
								<Box mt='2rem'>
									<Pagination
										page={parseInt(query.page) || 1}
										count={data.pagesCount}
										shape='rounded'
										component='link'
										classes={{ ul: styles.pagination }}
										renderItem={item => (
											<PaginationItem
												component={Link}
												to={`?${queryString.stringify({
													category,
													...query,
													page: item.page
												})}`}
												{...item}
											/>
										)}
									/>
								</Box>
							)}
    )
}

export default ProductsListing
