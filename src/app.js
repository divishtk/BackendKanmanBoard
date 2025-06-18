import express from 'express';
import healthCheckRouter from './routes/healthcheck.routes.js';
import authRouter from './routes/auth.routes.js';
import projectRouter from './routes/project.routes.js' 
import bodyParser from "body-parser"; // For parsing JSON bodies
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true })); // Parses form data
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

//router imports
app.use('/api/v1/healthcheck', healthCheckRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/project', projectRouter)

export default app;
