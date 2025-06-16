import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });
  res.status(200).json(user.savedRecipes); // масив ObjectId
}
