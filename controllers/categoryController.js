const fs = require('fs');
const Category = require('../models/category');
const tryCatch = require('../utils/tryCatch');
const appError = require('../utils/appError');
const { base64ToJimpInstance, createImageId } = require('./utils');

const createCategory = tryCatch(async (req, res, next) => {
	if (!req.body.image.buffer) {
		return next(new appError('Category image is required', 400));
	}
	const categoryImage = createImageId(req.body.image.buffer);

	const category = await new Category({
		...req.body,
		image: categoryImage.imageId
	}).save();

	base64ToJimpInstance(categoryImage.buffer)
		.then(instance => {
			instance.writeAsync(`categoryImages/${categoryImage.imageId}.jpeg`);
			res.status(201).send('Category has been added');
		})
		.catch(e => {
			category.remove();
			next(
				new appError(
					'there was an error processing this image please try another image',
					400
				)
			);
		});
});

const getCategoryById = tryCatch(async (req, res, next) => {
	const category = await Category.findById(req.params.id);
	if (!category) {
		return next(new appError("Category Wasn't found", 404));
	}
	res.send({ category, imageBaseUrl: `${process.env.CATEGORY_IMAGES_PATH}/` });
});

const updateCategory = tryCatch(async (req, res, next) => {
	if (!req.body.image.buffer && !req.body.image.url) {
		return next(new appError('Category image is required', 400));
	}

	const category = await Category.findById(req.params.id);
	if (!category) {
		return next(new appError("Category Wasn't found", 404));
	}

	let image = category.image;
	if (req.body.image.buffer) {
		// image changed
		const { imageId, buffer } = createImageId(req.body.image.buffer);
		base64ToJimpInstance(buffer).then(instance =>
			instance.writeAsync(`categoryImages/${imageId}.jpeg`)
		);
		fs.unlink(`categoryImages/${image}.jpeg`, () => {});
		image = imageId;
	}

	const updatedCategory = await category.updateOne(
		{ ...req.body, image },
		{ runValidators: true }
	);
	res.send(updatedCategory);
});

const getAllCategories = tryCatch(async (req, res, next) => {
	const categories = await Category.find();
	return res.send({
		categories,
		imageBaseUrl: `${process.env.CATEGORY_IMAGES_PATH}/`
	});
});

module.exports = {
	createCategory,
	getCategoryById,
	updateCategory,
	getAllCategories
};
