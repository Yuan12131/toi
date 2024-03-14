import { NextApiRequest, NextApiResponse } from "next";
import { pool, closeDB, connectDB } from "@/utils/db";
import jwt from "jsonwebtoken";

const secretKey = "yuan";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    connectDB()

    try {
        if (req.method === "POST") {
        const { userId, password } = req.body;

        const [rows] = await pool.query("SELECT * FROM Users WHERE userId = ?", [
        userId,
        ]);

        if (rows) {
            if (rows.isWithdrawn === 1) {
                res.status(401).json({ error: "withdraw user" });
            } else if (password === rows.password) {

                const token = jwt.sign(
                {
                User_Index: rows.User_Index,
                userId: rows.userId,
                name: rows.name,
                birthdate: rows.birthdate,
                phoneNumber: rows.phoneNumber,
                email: rows.email,
                postcode: rows.postcode,
                address: rows.address,
                detailaddress: rows.detailaddress,
                gender: rows.gender,
                },
                secretKey,
                { expiresIn: "3h" }
            );

            const verified = jwt.verify(token, secretKey);

            res.status(200).json({ token });
            } else {
            // 비밀번호 불일치
            res
                .status(401)
                .json({ error: "비밀번호가 일치하지 않습니다." });
            }
        } else {
            // 사용자를 찾을 수 없음
            res
            .status(401)
            .json({ error: "사용자를 찾을 수 없습니다." });
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
