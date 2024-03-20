import { NextApiRequest, NextApiResponse } from "next";
import { connectDB, getDB, closeDB } from "@/utils/mongodb";
const { ObjectId } = require("mongodb");
import jwt from "jsonwebtoken";

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ error: "토큰이 제공되지 않았습니다." });
    }

    const decodedToken = jwt.verify(token, secretKey);
    if (!decodedToken) {
      console.error("jwt malformed");
    }
    const User_Index = decodedToken.User_Index;
    const userIndex = new ObjectId(User_Index);

    const db = getDB();
    const travelPlansCollection = db.collection("TravelPlans");

    const TravelPlans = await travelPlansCollection
      .find({ userIndex: userIndex }).toArray();

      res.status(200).json({ TravelPlans });

      if (!TravelPlans) {
        return res.status(404).json({ error: "User not found" });
      }

  } catch (error) {
    console.error("Error fetching subscription data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  } finally {
    closeDB(); // Connection should be released after using
  }
}
