import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  code: { type: String, required: true },
  instructor: { type: String, required: true },
  syllabus: {
    type: {
      format: { type: String, enum: ['text', 'pdf', 'image'], required: true },
      content: { type: String, required: true } // Store the URL or base64 string for files/images
    },
    required: true
  },
});

export default mongoose.model('Course', CourseSchema);
