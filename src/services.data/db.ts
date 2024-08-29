import { Pool } from 'pg';

export const pool = new Pool({
    user: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    database: process.env.PG_DB,
});



