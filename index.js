import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bootstrap from './src/app.controller.js';
import globalErrorHandler from './src/utils/errorHandler/globalErrorHandler.js';
import db from './src/config/database.js';
dotenv.config();



const app = express();




await bootstrap(app, express);

app.listen(process.env.PORT||3000,()=> {
    console.log(`server started on port ${process.env.PORT||3000}`);
})

