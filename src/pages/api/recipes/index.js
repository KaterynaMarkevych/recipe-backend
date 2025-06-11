import mongoose from "mongoose";
import { connectToDatabase } from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
  await connectToDatabase();

  const session = await getServerSession(req, res, authOptions);

  if (req.method === "POST") {
    try {
      console.log("Тіло запиту:", req.body);
      if (!session) {
        return res.status(401).json({ message: "Неавторизований доступ" });
      }
      delete req.body.authorId;
      const recipe = new Recipe({
        ...req.body,
        author: new mongoose.Types.ObjectId(req.body.author),
      });

      await recipe.save();
      return res.status(201).json({ message: "Рецепт додано", recipe });
    } catch (error) {
      console.error("Помилка при збереженні рецепта:", error);
      return res.status(500).json({
        message: "Помилка при збереженні рецепта",
        error: error.message,
      });
    }
  }

  if (req.method === "GET") {
    try {
      const recipes = await Recipe.find();
      return res.status(200).json(recipes);
    } catch (error) {
      return res.status(500).json({
        message: "Помилка при отриманні рецептів",
        error: error.message,
      });
    }
  }

  return res.status(405).json({ message: "Метод не дозволений" });
}
