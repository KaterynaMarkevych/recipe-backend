import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Recipe from "@/models/Recipe";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email }).lean();
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Рахуємо кількість опублікованих рецептів цього користувача
  const publishedCount = await Recipe.countDocuments({
    author: new mongoose.Types.ObjectId(user._id),
    is_published: true,
  });

  // Повертаємо користувача разом зі статистикою
  res.status(200).json({
    ...user,
    stats: {
      published: publishedCount,
    },
  });
}
