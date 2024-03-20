import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";
require("dotenv").config();

import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "POST") {
      const { userId, password } = req.body;
      const db = getDB(); // MongoDB 데이터베이스 가져오기
      const usersCollection = db.collection("users"); // "users" 컬렉션 선택
      const user = await usersCollection.findOne({ userId }); // userId로 사용자 조회

      if (user) {
        if (user.isWithdrawn === true) {
          res.status(401).json({ error: "withdraw user" });
        } else if (password === user.password) {
          const token = jwt.sign(
            {
              User_Index: user._id,
              userId: user.userId,
              name: user.name,
              birthdate: user.birthdate,
              phoneNumber: user.phoneNumber,
              email: user.email,
              postcode: user.postcode,
              address: user.address,
              detailaddress: user.detailaddress,
              gender: user.gender,
            },
            secretKey,
            { expiresIn: 10800 }
          );

          res.status(200).json({ token });
          const decodedToken = jwt.verify(token, secretKey);
        } else {
          // 비밀번호 불일치
          res.status(401).json({ error: "비밀번호가 일치하지 않습니다." });
        }
      } else {
        // 사용자를 찾을 수 없음
        res.status(401).json({ error: "사용자를 찾을 수 없습니다." });
      }
    } else {
      // 허용되지 않은 메서드
      res.status(405).json({ error: "허용되지 않은 메서드" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "서버 에러" });
  } finally {
    closeDB(); // Connection should be released after using
  }
}
