import Bootcamp from '../models/Bootcamp.js';
import { ErrorResponse } from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js';
import geocoder from '../utils/geocoder.js';

const getBootcamps = asyncHandler(async (req, res, next) => {
    
    const selectFields = req.query.select;
    const sort = req.query.sort;
    const page = req.query.page || 1;
    const limit = req.query.limit || 100;
    
    let queryParams = { ...req.query};
    delete queryParams.select;
    delete queryParams.sort;
    delete queryParams.page;
    delete queryParams.limit;

    const query = Object.keys(queryParams).length === 0 ? Bootcamp.find() : Bootcamp.find(
        JSON.parse(JSON.stringify(queryParams).replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`))
    ).skip((page - 1) * limit).limit(limit);

    if (selectFields) {
        query.select(selectFields.replace(',', ' '));
    }
    
    sort ? query.sort(sort.replace(',', ' ')) : query.sort('-createdAt');
    
    query.populate('courses');
    res.status(200).json(await query);
});

const getBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    bootcamp ? res.status(200).json(bootcamp) : 
        next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
});

const createBootcamp = asyncHandler(async (req, res, next) => {
    res.status(201).json(await Bootcamp.create(req.body));
});

const updateBootcamp = asyncHandler(async(req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    bootcamp ? res.status(200).json(bootcamp) : res.status(404).send(); 
});

const deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        next(new ErrorResponse(`Bootcamp not found with id ${req.params.id}`, 404));
    }
    bootcamp.deleteOne();
    res.status(200).send();
});

const getBootcampsInRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    const loc = await geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;

    // Earth Radius in miles
    const radius = distance / 3963;
    
    const bootcamps = await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [ [ lng, lat ], radius ] } }
    });

    res.status(200).json(bootcamps);
});

export { 
    getBootcamp, 
    getBootcamps, 
    createBootcamp, 
    updateBootcamp, 
    deleteBootcamp, 
    getBootcampsInRadius 
};