import { connectDB, getDB, closeDB } from "@/utils/mongodb";
const { ObjectId } = require("mongodb");

import jwt from "jsonwebtoken";
import { v4 } from "uuid";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function POST(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const plans = req.body;

  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  await connectDB();

  try {
    const decodedToken = await verifyToken(token);
    const User_Index = decodedToken.User_Index;
    const userIndex = new ObjectId(User_Index);
    const courseIndex = v4();

    const db = getDB();
    const travelPlansCollection = db.collection("TravelPlans");

    for (const plan of plans) {
      const { day, date, time, place_name, formatted_address, photo } = plan;

      try {
        const result = await travelPlansCollection.insertOne({
          userIndex,
          courseIndex,
          day,
          date,
          time,
          place_name,
          formatted_address,
          photo,
          timestamp: new Date(),
        });

        const insertedId = result._id;

        res.json({ success: true, insertedId });
      } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Database error" });
      }
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  } finally {
    closeDB();
  }
}

async function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    throw error;
  }
}
