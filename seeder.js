import { readFileSync } from 'fs'
import dotenv from 'dotenv';
import Bootcamp from './models/Bootcamp.js';
import Course from './models/Course.js';
import { connection } from './config/mongo-config.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: './config/config.env'});
connection();


const bootcamps = JSON.parse(
    readFileSync(`${__dirname}/resources/bootcamps.json`)
);

const courses = JSON.parse(
    readFileSync(`${__dirname}/resources/courses.json`)
);

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data imported');
    } catch(err) {
        console.error(`There was an error when importing data ${err}`);
    } finally {
        process.exit();
    }
};

const deleteData = async () => {
    try {
        await Bootcamp.deleteMany();
        await Course.deleteMany();
        console.log('Data destroyed');
    } catch(err) {
        console.error(`There was an error when deleting data ${err}`);
    } finally {
        process.exit();
    }
};

const arg = process.argv[2];

if (arg === '-i' || arg === '-import') {
    importData();
} else if (arg === '-d' || arg === '-delete') {
    deleteData();
}