import { pool, connectDB, closeDB } from "@/utills/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { userId } = req.query;

        const [rows] = await pool.query("SELECT * FROM Users WHERE userId = ?", [
        userId,
        ]);

        if (rows) {
            res.json({ isDuplicate: true });
        } else  {
            res.json({ isDuplicate: false });
        }
    } catch (error) {
        console.error("Error checking duplicate:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
