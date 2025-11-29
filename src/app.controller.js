import dotenv from 'dotenv';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/database.js';
import globalErrorHandler from './utils/errorHandler/globalErrorHandler.js';
import userRouter from './Routs/userRout.js';
import doctorRouter from './Routs/DoctorRout.js';
import appointmentsRouter from './Routs/appointmentsRout.js';
import departmentsRouter from './Routs/DepartmentsRout.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const bootstrap = async (app , express) => {
    await db.connect();
    app.use(express.json());
    // Routes
    app.use("/user", userRouter);
    app.use("/doctor", doctorRouter);
    app.use("/appointments", appointmentsRouter);
    app.use("/department", departmentsRouter);
    app.use('/files', express.static(path.join(__dirname, 'files')));
    // Serve static files from uploads directory
    app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
    
    app.use(globalErrorHandler);

}

export default bootstrap;
