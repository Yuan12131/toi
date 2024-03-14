import { NextApiRequest, NextApiResponse } from "next";
import { pool, closeDB, connectDB } from "@/utils/db";
import jwt from "jsonwebtoken";

const secretKey = "yuan";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  connectDB()
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

      // 데이터베이스에서 isWithdrawn 상태를 true로 변경
      const result = await pool.query(
        "UPDATE Users SET isWithdrawn = 1 WHERE userId = ?",
        [userId]
      );

      if (result.affectedRows === 1) {
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
  };
