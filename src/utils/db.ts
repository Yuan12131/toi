const mariadb = require('mariadb')
const password = process.env.NEXT_PUBLIC_DB_PASSWORD;

export const pool = mariadb.createPool({
  host: 'localhost',
  port: "3306",
  user: 'root',
  password: password,
  database: "toui",
  connectionLimit: 25,
});


export async function connectDB() {
  try {
    await pool.getConnection();
    console.log('Database connected');
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export async function closeDB() {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connection:", error);
  }
}