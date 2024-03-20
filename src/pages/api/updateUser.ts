import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function PUT(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    if (req.method === "PUT") {
      // 인증된 사용자인지 확인
      const token = req.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        console.error("토큰이 제공되지 않았습니다.");
        return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
      }

      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken) {
        console.error("토큰이 유효하지 않습니다.");
        return res.status(401).json({ error: "토큰이 유효하지 않습니다." });
      }

      const user_Index = decodedToken.User_Index;

      // 클라이언트에서 보낸 업데이트할 사용자 정보
      const {
        name,
        birthdate,
        phoneNumber,
        email,
        postcode,
        address,
        detailaddress,
        gender,
      } = req.body;

      const db = getDB();
      const usersCollection = db.collection("users");

      // 데이터베이스에서 사용자 정보 업데이트
      const result = await usersCollection.updateOne(
        { _id: new ObjectId(user_Index) }, // ObjectId로 변환하여 사용자 조회
        {
          $set: {
            name,
            birthdate: new Date(birthdate),
            phoneNumber,
            email,
            postcode,
            address,
            detailaddress,
            gender,
          },
        }
      );

      if (result.matchedCount === 1) {
        // 업데이트 성공 시 새로운 토큰 발급
        const newToken = jwt.sign(
          {
            name,
            birthdate,
            phoneNumber,
            email,
            postcode,
            address,
            detailaddress,
            gender,
          },
          secretKey,
          { expiresIn: "1h" }
        );
        res.status(200).json({ token: newToken });
      } else {
        console.error("사용자를 찾을 수 없습니다.");
        res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
      }
    } else {
      console.error("허용되지 않은 메서드");
      res.status(405).json({ error: "허용되지 않은 메서드" });
    }
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    closeDB();
  }
}
