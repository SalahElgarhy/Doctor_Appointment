import express from 'express';
import { addDepartment, getAllDepartments, getOneDepartment, updateDepartment, deleteDepartment } from '../controller/DepartmentsController.js';
import { validateSchema } from '../validation/validation.middleware.js';
import { departmentValidation } from '../validation/departmentValidation.js';
import { upload } from '../utils/multer/upload.js';
import { authMiddleware } from '../utils/errorHandler/authMiddleware.js';

const departmentsRouter = express.Router();

departmentsRouter.post('/add', authMiddleware, upload.single('image'), validateSchema(departmentValidation), addDepartment);
departmentsRouter.get('/all_departments', getAllDepartments);
departmentsRouter.get('/one_department/:id', getOneDepartment);
departmentsRouter.put('/update/:id', authMiddleware, upload.single('image'), updateDepartment);
departmentsRouter.delete('/delete/:id', authMiddleware, deleteDepartment);

export default departmentsRouter;