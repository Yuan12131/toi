import { connectDB, getDB, closeDB } from "@/utils/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  try {
    const { userId } = req.query;

    const db = getDB(); // MongoDB 데이터베이스 가져오기

    const usersCollection = db.collection("users"); // "users" 컬렉션 선택

    const user = await usersCollection.findOne({ userId }); // userId로 사용자 조회

    if (user) {
      res.json({ isDuplicate: true });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    console.error("Error checking duplicate:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDB(); // Connection should be released after using
  }
}
