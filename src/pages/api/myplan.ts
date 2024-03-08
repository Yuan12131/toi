import { NextApiRequest, NextApiResponse } from "next";
import { pool, connectDB, closeDB } from "@/utils/db";
import jwt from "jsonwebtoken";

const secretKey = "yuan";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      console.error("jwt malformed");
    }
    const userIndex = decodedToken.User_Index;
    const TravelPlans = await pool.query(
      "SELECT courseIndex, day, date, time, place_name, formatted_address, photo, timestamp FROM TravelPlans WHERE User_Index = ? AND status = 0",
      [userIndex]
    );

    if (TravelPlans) {
      res.status(200).json({ TravelPlans });
    } else {
      res.status(404).json({ error: "TravelPlans를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("Error fetching subscription data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
