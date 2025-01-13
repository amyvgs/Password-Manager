const { Pool } = require('pg');
require('dotenv').config();

// create pool connection to external database
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl : {
        rejectUnauthorized: false,
    }
});

// test database connection
pool
    .query("SELECT NOW()")
    .then((res) => console.log('Database connection issued at : ', res.rows[0].now))
    .catch((err) => console.error('Database could not connect: ', err.stack));


// close database connection safely 
process.on("SIGINT", async() => {
    console.log("Shutting down database connection...");
    await pool.end();
    console.log("Database connection closed");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    console.log("Shutting down database connection...");
    await pool.end();
    console.log("Database connection closed");
    process.exit(0);
});


// export pool for future database coonnections
module.exports = pool;
