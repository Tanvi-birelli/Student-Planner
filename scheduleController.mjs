// controllers/scheduleController.mjs
import Schedule from '../models/Schedule.mjs';

// Get all schedules
export const getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ user: req.user.id }).populate('course');
    res.json(schedules);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Add a new schedule
export const addSchedule = async (req, res) => {
  const { course, day, startTime, endTime, location } = req.body;

  if (!course || !day || !startTime || !endTime || !location) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newSchedule = new Schedule({
      user: req.user.id,
      course,
      day,
      startTime,
      endTime,
      location,
    });

    const schedule = await newSchedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a schedule
export const updateSchedule = async (req, res) => {
  const { course, day, startTime, endTime, location } = req.body;

  const updatedSchedule = { course, day, startTime, endTime, location };

  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    if (schedule.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    schedule = await Schedule.findByIdAndUpdate(
      req.params.id,
      { $set: updatedSchedule },
      { new: true }
    );

    res.json(schedule);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Delete a schedule
export const deleteSchedule = async (req, res) => {
  try {
    let schedule = await Schedule.findById(req.params.id);

    if (!schedule) {
      return res.status(404).json({ msg: 'Schedule not found' });
    }

    if (schedule.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await Schedule.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Schedule removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

