import { Router } from "express";
import { register, login, verifyEmail, getMe } from '../controllers/auth.controller.js';
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { authUser } from "../middleware/auth.middleware.js";
const router = Router();

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body { username, email, password }
 */
router.post('/register', registerValidator ,register);

/**
 * @route POST /api/auth/login
 * @desc Login a new user
 * @access Public
 * @body { username, email, password }
 */
router.post('/login', loginValidator ,login);

/**
 * @route POST /api/auth/verify-email
 * @desc verify new user email
 * @access Public
 * @body { query => token }
 */
router.get('/verify-email', verifyEmail);

/**
 * @route POST /api/auth/get-me
 * @desc Get current logged in user details
 * @access Private
 * @body { query => token }
 */
router.get('/get-me', authUser, getMe);

export default router;