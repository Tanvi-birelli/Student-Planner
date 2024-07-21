import express from 'express';
import { getCourses, addCourse, getCourse, updateCourse, deleteCourse } from '../controllers/courseController.mjs';
import upload from '../middleware/upload.mjs';
import auth from '../middleware/auth.mjs'; // Import the auth middleware

const router = express.Router();

router.get('/', auth, getCourses); // Apply auth middleware here
router.post('/', auth, upload.single('syllabusFile'), addCourse);
router.get('/:id', auth, getCourse);
router.put('/:id', auth, upload.single('syllabusFile'), updateCourse);
router.delete('/:id', auth, deleteCourse);

export default router;
