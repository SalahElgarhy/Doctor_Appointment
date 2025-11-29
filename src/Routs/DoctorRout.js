import express from 'express';
import { asyncHandler } from '../utils/errorHandler/asyncHandler.js';
import { addDoctor, activateDoctorAccount, doctorLogin, getOneDoctorById , getallDoctors} from '../controller/DoctorController.js';
import { validateSchema } from '../validation/validation.middleware.js';
import { addDoctorValidation } from '../validation/doctorvalidation.js';
import { sanitizeInput } from '../validation/validation.middleware.js';
import { tokenValidation, loginValidation } from '../validation/userValidation.js';
import { upload } from '../utils/multer/upload.js';

const router = express.Router();

// Sanitize input for all routes
router.use(sanitizeInput);

// Add doctor route with image upload (multipart/form-data)
router.post('/add', upload.single('image'), validateSchema(addDoctorValidation), asyncHandler(addDoctor));

// Doctor login route
router.post('/login', validateSchema(loginValidation), asyncHandler(doctorLogin));

// Get one doctor by ID
router.get('/one_doctor/:id', asyncHandler(getOneDoctorById));

router.get('/all_doctors' , asyncHandler(getallDoctors));
// Activate doctor account route
router.get('/activate_account/:token', validateSchema(tokenValidation), asyncHandler(activateDoctorAccount));

export default router;