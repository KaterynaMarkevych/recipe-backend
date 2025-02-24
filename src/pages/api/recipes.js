import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { runCors } from "../../lib/cors";

export default async function handler(req, res) {
  // Спочатку викликаємо CORS
  runCors(req, res, async () => {
    try {
      await connectToDatabase(); // підключення до БД
      const recipes = await Recipe.find({}); // отримання всіх рецептів
      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Помилка при отриманні рецептів", error });
    }
  });
}
