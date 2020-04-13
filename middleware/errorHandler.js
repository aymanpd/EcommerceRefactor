const appError = require('../utils/appError');

const sendErrorProduction = (err, res) => {
	if (err.isOperational) {
		res.status(err.code).send(err.message);
	} else {
		res.status(500).send('Something went wrong, plase try again later');
	}
};

const sendErrorDevelopment = (err, res) => {
	console.log(err);
	if (err.isOperational) {
		res.status(err.code).send(err.message);
		console.log(err);
	} else {
		res.status(500).send(err);
	}
};

const errorHandler = (err, req, res, next) => {
	const sendError =
		process.env.NODE_ENV === 'DEVELOPMENT'
			? sendErrorDevelopment
			: sendErrorProduction;
	if (err.name == 'ValidationError') {
		const errors = Object.values(err.errors).map(error =>
			error.name == 'CastError' ? `Invalid ${error.path} ID` : error.message
		);
		const errorMessage = errors.join('. ', errors);
		return sendError(new appError(errorMessage, 400), res);
	}
	if (err.code === 11000) {
		const errorMessage = `${
			err.errmsg.match(/(["'])(\\?.)*?\1/)[0]
		} Already exists`;
		return sendError(new appError(errorMessage, 400), res);
	}
	if (err.name === 'CastError') {
		const errorMessage = 'Invalid Id';
		return sendError(new appError(errorMessage, 400), res);
	}
	sendError(err, res);
};

module.exports = errorHandler;
