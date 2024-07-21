import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.mjs';
import courseRoutes from './routes/courses.mjs';
import resourceRoutes from './routes/resources.mjs';
import taskRoutes from './routes/tasks.mjs';
import scheduleRoutes from './routes/schedules.mjs';
import userRoutes from './routes/users.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors()); // Add this line for CORS support
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../frontend')));
//app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Define Routes
app.use('/api/courses', courseRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/users', userRoutes); 

app.get('/uploads/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);

    // Determine file type based on extension
    const extname = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (extname === '.pdf') {
        contentType = 'application/pdf';
    } else if (extname === '.jpg' || extname === '.jpeg') {
        contentType = 'image/jpeg';
    } else if (extname === '.png') {
        contentType = 'image/png';
    }

    res.sendFile(filePath, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': extname === '.pdf' ? 'inline' : 'attachment' // Display inline for PDFs, download for images
        }
    });
});


const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
