import Course from '../models/Course.mjs';
import path from 'path';

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user.id });
    res.json(courses);
  } catch (err) {
    console.error('Error fetching courses:', err.message);
    res.status(500).send('Server error');
  }
};

// Add a new course
export const addCourse = async (req, res) => {
  const { title, code, instructor, syllabusFormat, syllabusContent } = req.body;
  
  try {
    let syllabus = {};
    if (syllabusFormat === 'text') {
      syllabus = { format: syllabusFormat, content: syllabusContent };
    } else if (req.file) {
      const filePath = path.join('uploads', req.file.filename);
      syllabus = { format: syllabusFormat, content: filePath };
    } else {
      return res.status(400).json({ msg: 'File upload failed' });
    }

    const newCourse = new Course({
      user: req.user.id,
      title,
      code,
      instructor,
      syllabus
    });

    const course = await newCourse.save();
    res.json(course);
  } catch (err) {
    console.error('Error adding course:', err.message);
    res.status(500).send('Server error');
  }
};
// Get a specific course
export const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    res.json(course);
  } catch (err) {
    console.error('Error fetching course:', err.message);
    res.status(500).send('Server error');
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  const { title, code, instructor, syllabusFormat, syllabusContent } = req.body;

  let syllabus = {};
  if (syllabusFormat === 'text') {
    syllabus = { format: syllabusFormat, content: syllabusContent };
  } else if (req.file) {
    const filePath = path.join('uploads', req.file.filename);
    syllabus = { format: syllabusFormat, content: filePath };
  }

  const updatedCourse = { title, code, instructor, syllabus };

  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: updatedCourse },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    console.error('Error updating course:', err.message);
    res.status(500).send('Server error');
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ msg: 'Course not found' });
    }
    if (course.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Course.findByIdAndDelete(req.params.id);

    res.json({ msg: 'Course removed' });
  } catch (err) {
    console.error('Error deleting course:', err.message);
    res.status(500).send('Server error');
  }
};
