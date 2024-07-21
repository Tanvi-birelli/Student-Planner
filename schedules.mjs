// routes/schedules.mjs
import express from 'express';
import { getSchedules, addSchedule, updateSchedule, deleteSchedule } from '../controllers/scheduleController.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// Get all schedules
router.get('/', auth, getSchedules);

// Add a new schedule
router.post('/', auth, addSchedule);

// Update a schedule
router.put('/:id', auth, updateSchedule);

// Delete a schedule
router.delete('/:id', auth, deleteSchedule);

export default router;
