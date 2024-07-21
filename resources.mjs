import express from 'express';
import { getResources, addResource, updateResource, deleteResource} from '../controllers/resourceController.mjs';
import auth from '../middleware/auth.mjs';

const router = express.Router();

// Get all resources
router.get('/', auth,getResources);

// Add a new resource
router.post('/', auth,addResource);

// Update a resource
router.put('/:id', auth,updateResource);
// Delete a resource
router.delete('/:id', auth,deleteResource);

export default router;
