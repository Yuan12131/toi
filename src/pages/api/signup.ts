import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  try {
    if (req.method === "POST") {
      const {
        userId,
        password,
        name,
        birthdate,
        phoneNumber,
        email,
        postcode,
        address,
        detailaddress,
        gender,
      } = req.body;

      const isWithdrawn = false;

      const db = getDB(); // MongoDB 데이터베이스 가져오기

      const usersCollection = db.collection("users"); // "users" 컬렉션 선택

      // 예시 데이터 삽입
      await usersCollection.insertOne({
        userId,
        password,
        name,
        birthdate: new Date(birthdate),
        phoneNumber,
        email,
        postcode,
        address,
        detailaddress,
        gender,
        joinDate: new Date(),
        isWithdrawn,
      });

      res.status(200).json({ message: "회원가입 성공" });
    } else {
      res.status(405).json({ error: "허용되지 않은 메서드" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  } finally {
    await closeDB(); // Connection should be released after using
  }
}
