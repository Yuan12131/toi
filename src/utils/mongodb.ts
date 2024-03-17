require('dotenv').config(); // .env 파일의 환경 변수 로드

const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI; // MongoDB 서버 URI를 환경 변수로부터 가져옴

let db;

export async function connectDB() {
  try {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    db = client.db('toui'); // MongoDB에서 사용할 데이터베이스 선택
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
}

export async function closeDB() {
  try {
    if (db) {
      await db.client.close();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
}
