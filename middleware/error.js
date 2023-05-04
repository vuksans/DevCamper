import { ErrorResponse } from "../utils/errorResponse.js";

const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    
    // Mongoose bad object Id
    if (err.name === 'CastError') {
        const message = `Entity not found with the id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    else if (err.code === 11000) {
        const message = 'Duplicate field value entered';    
        error = new ErrorResponse(message, 400);
    }

    else if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new ErrorResponse(message, 400);
    }
    console.error(error);
    res.status(error.statusCode || 500).json({
        error: err.message
    });
};

export default errorHandler;