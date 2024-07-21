// models/Resource.mjs
import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  link: { type: String, required: true },
});

export default mongoose.model('Resource', ResourceSchema);
