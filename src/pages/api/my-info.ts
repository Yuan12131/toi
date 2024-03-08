import { NextApiRequest, NextApiResponse } from "next";
import { pool, connectDB, closeDB } from "@/utils/db";
import jwt from "jsonwebtoken";

const secretKey = "yuan";

export default async function POST(req: NextApiRequest, res: NextApiResponse) {

    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
  
      if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const decodedToken = jwt.verify(token, secretKey);
      if (!decodedToken || !decodedToken.User_Index) {
        return res.status(401).json({ error: "Invalid token" });
      }
  
      const userIndex = decodedToken.User_Index;
  
      const [myInfo] = await pool.query("SELECT * FROM Users WHERE User_Index = ?", [
        userIndex,
      ]);
  
      if (myInfo.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json( {myInfo} );
    } catch (error) {
      console.error("Error fetching user info:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };