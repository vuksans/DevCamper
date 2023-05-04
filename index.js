import express, { json } from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import { connection } from './config/mongo-config.js';
import bootcampRoutes from './routes/bootcamps.js';
import courseRoutes from './routes/courses.js';
import errorHandler from './middleware/error.js';

config({ path: './config/config.env'});

// Connect to mongo
connection();

const app = express();
app.use(json());

if (process.env === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/v1/bootcamps', bootcampRoutes);
app.use('/api/v1/courses', courseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`App listening on port ${PORT}!`));

process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
});

