// routes/users.mjs
import express from 'express';
import { registerUser, authUser, getUser, changePassword} from '../controllers/userController.mjs';
import auth from '../middleware/auth.mjs';
import { check } from 'express-validator';

const router = express.Router();

// Register user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// Authenticate user & get token
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  authUser
);

// Get user data
router.get('/', auth, getUser);


router.put('/password', auth, [
  check('oldPassword', 'Old password is required').exists(),
  check('newPassword', 'New password must be 6 or more characters').isLength({ min: 6 })
], changePassword);

export default router;
