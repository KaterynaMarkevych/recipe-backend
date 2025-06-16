import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import User from "@/models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ message: "Not authenticated" });

  if (req.method !== "POST")
    return res.status(405).json({ message: "Method not allowed" });

  const { recipeId } = req.body;
  if (!recipeId)
    return res.status(400).json({ message: "Recipe ID is required" });

  await connectToDatabase();
  const user = await User.findOne({ email: session.user.email });

  if (!user) return res.status(404).json({ message: "User not found" });

  // Ensure savedRecipes exists
  if (!Array.isArray(user.savedRecipes)) user.savedRecipes = [];

  const alreadySaved = user.savedRecipes.includes(recipeId);

  if (alreadySaved) {
    user.savedRecipes.pull(recipeId); // remove
  } else {
    user.savedRecipes.push(recipeId); // add
  }

  await user.save();
  return res.status(200).json({
    message: alreadySaved ? "Removed from saved" : "Saved successfully",
    saved: !alreadySaved,
  });
}
