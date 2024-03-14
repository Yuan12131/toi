import { pool, closeDB, connectDB } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

const secretKey = "yuan";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" }); // Handle non-POST requests
  }
  const plans = req.body;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  await connectDB()

  try {
    const decodedToken = await verifyToken(token);
    const User_Index = decodedToken.User_Index;
    const courseIndex = v4();

    for (const plan of plans) {
      const { day, date, time, place_name, formatted_address, photo } = plan;

      try {
        const results = await pool.execute(
          `INSERT INTO TravelPlans (User_Index, courseIndex, day, date, time, place_name, formatted_address, photo, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            User_Index,
            courseIndex,
            day,
            date,
            time,
            place_name,
            formatted_address,
            photo,
          ]
        );

        const insertedId = results.id;

        res.json({ success: true, insertedId });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
      }
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }finally {
    closeDB(); // Connection should be released after using
}
}

async function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw error;
  } 
}
