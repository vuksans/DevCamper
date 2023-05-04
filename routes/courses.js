import { Router } from 'express';
import { 
    getCourses, 
    createCourse, 
    getCourse, 
    deleteCourse, 
    updateCourse 
} from '../controllers/courses.js';

const router = Router({
    mergeParams: true
});
router.route('/').get(getCourses).post(createCourse);
router.route('/:id').get(getCourse).put(updateCourse).delete(deleteCourse);

export default router;