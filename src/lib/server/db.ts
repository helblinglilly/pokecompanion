import { env } from '$env/dynamic/private';
import mysql from 'mysql2';

const dbString = env.DATABASE_URL ?? '';

const pool = mysql.createPool(dbString);

export default pool;
