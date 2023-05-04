import { Router } from 'express';
import { 
    createBootcamp, 
    deleteBootcamp, 
    getBootcamp, 
    getBootcamps, 
    updateBootcamp,
    getBootcampsInRadius
} from '../controllers/bootcamps.js';
import courseRouter from './courses.js';

const router = Router();
router.route('/').get(getBootcamps).post(createBootcamp);
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

// Re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

export default router;