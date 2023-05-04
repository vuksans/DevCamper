import { ErrorResponse } from '../utils/errorResponse.js'
import asyncHandler from '../middleware/async.js';
import Course from '../models/Course.js';
import Bootcamp from '../models/Bootcamp.js';

const getCourses = asyncHandler(async (req, res, next) => { 
    const query = req.params.bootcampId ? Course.find({ bootcamp: req.params.bootcampId }) : Course.find();  
    res.status(200).json(await generatePopulateBootcampQuery(query));
});

const getCourse = asyncHandler(async (req, res, next) => {
    const bootcamp = await generatePopulateBootcampQuery(Course.findById(req.params.id));
    bootcamp ? res.status(200).json(bootcamp) : next(new ErrorResponse(`Course not found with id ${req.params.id}`, 404));
});

const createCourse = asyncHandler(async (req, res, next) => {
    const bootcampId = req.body.bootcamp;
    if (!bootcampId) {
        next(new ErrorResponse('Please provide a bootcamp id', 400));
    }
    
    const bootcamp = await Bootcamp.findById(req.body.bootcamp);
    if (!bootcamp) {
        next(new ErrorResponse(`Cannot find bootcamp with id ${bootcampId}`, 404));
    }
    res.status(201).json(await Course.create(req.body));
    
});

const deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id);
    if (!course) {
        next(new ErrorResponse(`Cannot find course with id: ${req.params.id}`, 404));
    }
    course.deleteOne();
    res.status(200).send();
});

const updateCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!course) {
        next(new ErrorResponse(`Cannot find course with id: ${req.params.id}`, 404));
    }
    res.status(200).json(course);
});

const generatePopulateBootcampQuery = (query) => {
    return query.populate({
        path: 'bootcamp',
        select: 'name description'
    })
};
export { getCourses, getCourse, createCourse, deleteCourse, updateCourse };