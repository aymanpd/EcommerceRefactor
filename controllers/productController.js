const fs = require('fs');
const mongoose = require('mongoose');
const moment = require('moment');
const tryCatch = require('../utils/tryCatch');
const Product = require('../models/product');
const appError = require('../utils/appError');
const { createImageId, uploadImagesToDisk } = require('./utils');

/* 
    Create Product
*/

const createProduct = tryCatch(async (req, res, next) => {
	const productData = req.body;
	const images = [];
	// validate colors
	if (!productData.colors || productData.colors.length == 0) {
		return next(
			new appError('Product Must Have At least one valid color', 400)
		);
	}

	const validColors = productData.colors.every(
		color => color.primaryImage.buffer && color.colorName
	);
	if (!validColors) {
		return next(
			new appError(
				'Each color must have Color Name, Primary and Secondary image',
				400
			)
		);
	}

	productData.colors = productData.colors.map(
		({ primaryImage, secondaryImage, gallery, ...rest }) => {
			const primaryImageWithId = createImageId(primaryImage.buffer);
			images.push(primaryImageWithId);

			let secondaryImageWithId;
			if (secondaryImage.buffer) {
				secondaryImageWithId = createImageId(secondaryImage.buffer);
				images.push(secondaryImageWithId);
			}
			let galleryIds = [];
			if (gallery && gallery.length > 0) {
				galleryIds = gallery.map(({ buffer }) => {
					const imageWithId = createImageId(buffer);
					images.push(imageWithId);
					return imageWithId.imageId;
				});
			}
			return {
				primaryImage: primaryImageWithId.imageId,
				secondaryImage: secondaryImage.buffer && secondaryImageWithId.imageId,
				gallery: galleryIds,
				...rest
			};
		}
	);

	const savedProduct = await Product(productData).save();
	if (savedProduct) {
		uploadImagesToDisk(images, savedProduct.id);
		res.status(201).send('testing');
	}
});

/* 
    Get Product By ID
*/

const getProductById = tryCatch(async (req, res, next) => {
	const product = await Product.findById(req.params.id)
		.lean()
		.populate('category');

	if (!product) {
		return next(new appError('Product Was not found', 404));
	}

	if (product.onSaleFrom && product.onSaleTo && product.salePrice) {
		const onSale = moment().isBetween(
			moment(product.onSaleFrom),
			moment(product.onSaleTo)
		);
		product.onSale = onSale;
	} else {
		product.onSale = false;
	}
	res.status(200).send({
		product,
		imagesBaseUrl: `${process.env.IMAGES_PATH}/${product._id}/`
	});
});

/* 
    Update Product 
*/

const updateProduct = tryCatch(async (req, res, next) => {
	const productData = req.body;
	const images = [];
	const usedImages = [];

	//validate colors
	if (!productData.colors || productData.colors.length == 0) {
		return next(
			new appError('Product Must Have At least one valid color', 400)
		);
	}
	const validColors = productData.colors.every(
		color =>
			(color.primaryImage.url || color.primaryImage.buffer) &&
			(color.primaryImage.url || color.primaryImage.buffer) &&
			color.colorName
	);
	if (!validColors) {
		return next(
			new appError('Each color must have primary and secondary image', 400)
		);
	}

	const modifiedColors = productData.colors.map(
		({ primaryImage, secondaryImage, gallery, ...rest }) => {
			const colorImages = {};
			if (primaryImage.buffer) {
				const primaryImageWithId = createImageId(primaryImage.buffer);
				colorImages.primaryImage = primaryImageWithId.imageId;
				images.push(primaryImageWithId);
			} else {
				colorImages.primaryImage = primaryImage.url; //no change
			}

			if (secondaryImage.buffer) {
				const secondaryImageWithId = createImageId(secondaryImage.buffer);
				colorImages.secondaryImage = secondaryImageWithId.imageId;
				images.push(secondaryImageWithId);
			} else {
				colorImages.secondaryImage = secondaryImage.url; //no change
			}

			if (gallery && gallery.length > 0) {
				if (gallery[0].buffer) {
					galleryIds = gallery.map(({ buffer }) => {
						const imageWithId = createImageId(buffer);
						images.push(imageWithId);
						return imageWithId.imageId;
					});
					colorImages.gallery = galleryIds;
				} else {
					colorImages.gallery = gallery.map(image => image.url); //no change
				}
				usedImages.push(...colorImages.gallery);
			}
			usedImages.push(colorImages.primaryImage);
			usedImages.push(colorImages.secondaryImage);
			return { ...rest, ...colorImages };
		}
	);
	const product = await Product.findByIdAndUpdate(
		req.params.id,
		{ ...productData, colors: modifiedColors },
		{ runValidators: true }
	);
	if (!product) {
		return next(new appError('there is no such Product to be updated', 404));
	}
	uploadImagesToDisk(images, product.id);

	// delete old images
	fs.readdir(`images/${product.id}`, function(err, items) {
		items.forEach(item => {
			if (usedImages.includes(item.replace('.jpeg', ''))) {
				return;
			}
			fs.unlink(`images/${product.id}/${item}`, () => {});
		});
	});

	res.status(201).send(`product with id ${product.id} updated`);
});

/* 
    Retrive All Products 
*/

const getAllProducts = tryCatch(async (req, res, next) => {
	const {
		page = 1,
		limit,
		sort = 'createdAt:desc',
		minPrice,
		maxPrice,
		sizes,
		colors,
		images,
		...params
	} = req.query;
	const resultsPerPage = parseInt(limit) ? parseInt(limit) : 0; // temporarily
	const skip = (page - 1) * resultsPerPage;

	// search and sale filter
	var Query = Product.find().populate('category');
	Object.keys(params).forEach(param => {
		const paramterValue = params[param];
		switch (param) {
			case 'search':
				Query = Query.find({ name: { $regex: paramterValue, $options: 'i' } });
				break;
			case 'onSale':
				if (paramterValue)
					Query = Query.find({
						onSaleFrom: { $lte: new Date() },
						onSaleTo: { $gte: new Date() }
					});
				break;
			default:
				Query = Query.find({ [param]: paramterValue });
		}
	});

	// color and size filter
	var queryBeforeColorFilter = Product.find().merge(Query); // distinct color stay constant if color filter is chosen
	if (colors && sizes) {
		Query = Query.find({
			colors: {
				$elemMatch: { colorName: { $in: colors }, sizes: { $in: sizes } }
			}
		});
	} else if (colors) {
		Query = Query.find({ 'colors.colorName': { $in: colors } });
	} else if (sizes) {
		Query = Query.find({ 'colors.sizes': { $in: sizes } });
		queryBeforeColorFilter = Product.find().merge(Query); // distinct color changes if specific size chosen
	}

	// price filter
	const maxAndMinPrice = await Product.aggregate([
		{
			$match: { category: mongoose.Types.ObjectId(params.category) }
		},
		{
			$group: {
				_id: null,
				highestPrice: { $max: '$regularPrice' },
				lowestPrice: { $min: '$regularPrice' }
			}
		}
	]);
	const { highestPrice, lowestPrice } = maxAndMinPrice[0] || {};
	minPrice && (Query = Query.find({ regularPrice: { $gte: minPrice } }));
	maxPrice && (Query = Query.find({ regularPrice: { $lte: maxPrice } }));

	// sorting
	const [sortby, order] = sort.split(':');
	// select image
	const countProductsQuery = Product.find()
		.merge(Query)
		.countDocuments();
	Query.lean()
		.skip(skip)
		.limit(resultsPerPage)
		.sort({ [sortby]: order });

	// executing
	Promise.all([
		queryBeforeColorFilter.distinct('colors.colorName'), //available colors
		countProductsQuery, // total count
		Query //get products with first color image
	])
		.then(([availableColors, productsCount, products]) => {
			// add onsale property
			products.forEach(product => {
				if (product.onSaleFrom && product.onSaleTo && product.salePrice) {
					const onSale = moment().isBetween(
						moment(product.onSaleFrom),
						moment(product.onSaleTo)
					);
					product.onSale = onSale;
				} else {
					product.onSale = false;
				}
				product.imagesBaseUrl = `${process.env.IMAGES_PATH}/${product._id}/`;
			});
			res.send({
				products,
				productsCount,
				pagesCount: Math.ceil(productsCount / resultsPerPage),
				highestPrice,
				lowestPrice,
				availableColors
			});
		})
		.catch(err => {
			next(err);
		});
});

/* 
    Delete Product
*/

const deleteProduct = tryCatch(async (req, res, next) => {
	const product = await Product.findById(req.params.id);
	if (!product) {
		return next(new appError('Product Was not found', 404));
	}
	await product.delete();
	res.status(200).send('Product Deleted');
});
/*
    Load Cart
*/

const loadCart = tryCatch(async (req, res, next) => {
	if (!req.body || req.body.length == 0) {
		return next(new appError('There are no products in cart', 404));
	}
	const products = await Product.find({ _id: { $in: req.body } }).lean();

	if (!products) {
		return next(new appError('There are no products in cart', 404));
	}
	products.forEach(product => {
		product.imagesBaseUrl = `${process.env.IMAGES_PATH}/${product._id}/`;
		if (product.onSaleFrom && product.onSaleTo && product.salePrice) {
			const onSale = moment().isBetween(
				moment(product.onSaleFrom),
				moment(product.onSaleTo)
			);
			product.onSale = onSale;
		} else {
			product.onSale = false;
		}
	});
	res.send(products);
});

module.exports = {
	createProduct,
	updateProduct,
	getAllProducts,
	deleteProduct,
	getProductById,
	loadCart
};
