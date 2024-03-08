import { NextApiRequest, NextApiResponse } from "next";
import { pool, connectDB, closeDB } from "@/utils/db";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  connectDB()
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

        const isWithdrawn = 0;

        const result = await pool.query(
          `INSERT INTO users (userId, password, name, birthdate, phoneNumber, email, postcode, address, detailaddress, gender, joinDate, isWithdrawn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
          [
            userId,
            password,
            name,
            new Date(birthdate),
            phoneNumber,
            email,
            postcode,
            address,
            detailaddress,
            gender,
            isWithdrawn,
          ]
        );
        const rows = result.rows;
        res.status(200).json({ message: "회원가입 성공" });
      } else {
        res.status(405).json({ error: "허용되지 않은 메서드" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "서버 에러" });
    }
  };