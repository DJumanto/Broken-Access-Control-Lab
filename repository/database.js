import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const HOST = process.env.DB_HOST || 'localhost';
const PORT = process.env.DB_PORT || 3306;
const PASSWORD = process.env.DB_PASSWORD || 'root';
const USERNAME = process.env.DB_USERNAME || 'root';
const DATABASE = process.env.DB_DATABASE || 'test';

const pool = mysql.createPool({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
    port: PORT
});

const promisePool = pool.promise();

export default promisePool;