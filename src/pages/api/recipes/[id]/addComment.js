import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import Recipe from "@/models/Recipe";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Unauthorized" });

  const { id } = req.query;
  const { text } = req.body;

  if (!text) return res.status(400).json({ message: "Text is required" });

  await connectToDatabase();

  const user = await User.findOne({ email: session.user.email });
  const recipe = await Recipe.findById(id);

  if (!recipe) return res.status(404).json({ message: "Recipe not found" });

  recipe.comments.push({
    user: user._id,
    text,
    createdAt: new Date(),
  });

  await recipe.save();

  res.status(200).json({ message: "Comment added successfully" });
}
