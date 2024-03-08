import { NextApiRequest, NextApiResponse } from "next";
import { pool, connectDB, closeDB } from "@/utils/db";
import jwt from "jsonwebtoken";

const secretKey = "yuan";

export default async function PUT(req: NextApiRequest, res: NextApiResponse) {
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
        }

        const userId = decodedToken.userId;

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

        // 데이터베이스에서 사용자 정보 업데이트
        const result = await pool.query(
          "UPDATE Users SET name = ?, birthdate = ?, phoneNumber = ?, email = ?, postcode = ? , address = ?, detailaddress = ? , gender = ? WHERE userId = ?",
          [
            name,
            new Date(birthdate),
            phoneNumber,
            email,
            postcode,
            address,
            detailaddress,
            gender,
            userId,
          ]
        );

        if (result.affectedRows === 1) {
          // 업데이트 성공 시 새로운 토큰 발급
          const newToken = jwt.sign(
            {
              userId,
              name,
              birthdate,
              phoneNumber,
              email,
              postcode,
              address,
              detailaddress,
              gender,
              cash: decodedToken.cash, // 이 부분은 사용자 정보에 따라 추가 또는 수정해야 할 수 있습니다.
            },
            secretKey,
            { expiresIn: "1h" }
          );
          const newDecodedToken = jwt.verify(newToken, secretKey);
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
    }
  };