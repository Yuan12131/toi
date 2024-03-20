import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";
const { ObjectId } = require("mongodb");
import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // 토큰에서 유저의 _id 값 추출
    const userIndex = decodedToken.User_Index;

    // MongoDB에서 사용할 ObjectId로 변환
    const objectId = new ObjectId(userIndex);

    const db = getDB(); // MongoDB 데이터베이스 가져오기
    const usersCollection = db.collection("users"); // "users" 컬렉션 선택
    const myInfo = await usersCollection.findOne({ _id: objectId });

    if (!myInfo) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ myInfo });
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    await closeDB(); // Connection should be released after using
  }
}
