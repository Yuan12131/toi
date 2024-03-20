import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";
import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
    }

    const decodedToken = jwt.verify(token, secretKey);

    if (!decodedToken) {
      console.error("jwt malformed");
    }

    const userId = decodedToken.userId;

    const db = getDB();
    const usersCollection = db.collection("users");
    const result = await usersCollection.updateOne(
      { userId: userId },
      {
        $set: {
          isWithdrawn: true,
        },
      }
    );

    if (result.matchedCount === 1) {
      // 성공적으로 업데이트된 경우
      res.status(200).json({ message: "회원 탈퇴 성공" });
    } else {
      // 업데이트 실패 시
      res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error withdrawing user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    closeDB(); // Connection should be released after using
  }
}
