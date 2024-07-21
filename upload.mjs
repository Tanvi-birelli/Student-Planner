import multer from 'multer';
import path from 'path';

// Configure multer for file uploads
const upload = multer({
    dest: 'uploads/', // Destination directory
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size (e.g., 10MB)
    fileFilter(req, file, cb) {
        // Accept image files and PDF files
        if (!file.originalname.match(/\.(png|jpg|jpeg|pdf)$/)) {
            return cb(new Error('Please upload an image or PDF file.'));
        }
        cb(null, true);
    }
});

export default upload; // Named export
