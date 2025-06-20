import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  await connectToDatabase();

  const { username, bio, avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        username,
        bio,
        ...(avatar && { avatar }),
      },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Server error" });
  }
}
