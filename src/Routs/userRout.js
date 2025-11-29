import express from 'express';
import { asyncHandler } from '../utils/errorHandler/asyncHandler.js';
import { registerUser, loginUser, activateAccount } from '../controller/userController.js';
import {getOneUserById , getallUsers} from "../controller/userController.js";

import { 
    validateRegister, 
    validateLogin, 
    validateActivateAccount,
    sanitizeInput, 
    validateContentType 
} from '../validation/validation.middleware.js';

const router = express.Router();

// Apply general middlewares to all routes
router.use(sanitizeInput);
router.use(validateContentType);

router.post('/register', validateRegister, asyncHandler(registerUser));
router.post('/login', validateLogin, asyncHandler(loginUser));
router.get('/one_user/:id', asyncHandler(getOneUserById));
router.get('/all_users', asyncHandler(getallUsers));
router.get('/activate_account/:token', validateActivateAccount, asyncHandler(activateAccount));

export default router;