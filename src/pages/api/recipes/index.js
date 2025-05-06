import { connectToDatabase } from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";

export default async function handler(req, res) {
  await connectToDatabase();

  if (req.method === "POST") {
    try {
      const recipe = new Recipe(req.body);
      await recipe.save();
      return res.status(201).json({ message: "Рецепт додано", recipe });
    } catch (error) {
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
