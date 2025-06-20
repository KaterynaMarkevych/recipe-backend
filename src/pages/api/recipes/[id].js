import { connectToDatabase } from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import { runCors } from "../../../lib/cors";
import mongoose from "mongoose";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export default async function handler(req, res) {
  runCors(req, res, async () => {
    try {
      await connectToDatabase();

      const { id } = req.query;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Некоректний ID рецепту" });
      }

      const session = await getServerSession(req, res, authOptions);

      // GET — деталі рецепту (авторизація не потрібна)
      if (req.method === "GET") {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ message: "Рецепт не знайдено" });
        }
        return res.status(200).json(recipe);
      }

      // Для PUT, PATCH, DELETE — потрібна авторизація
      if (!session) {
        return res.status(401).json({ message: "Неавторизований доступ" });
      }

      // PUT — оновити рецепт
      if (req.method === "PUT") {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ message: "Рецепт не знайдено" });
        }
        if (recipe.author.toString() !== session.user.id) {
          return res.status(403).json({ message: "Немає прав доступу" });
        }

        const {
          title,
          ingredients,
          steps,
          cookingTime,
          image,
          tags,
          is_published,
          cuisine,
          nutrition,
          diet,
          type,
          difficulty,
          servings,
        } = req.body;

        // Оновлення полів
        recipe.title = title || recipe.title;
        recipe.ingredients = ingredients || recipe.ingredients;
        recipe.steps = steps || recipe.steps;
        recipe.cookingTime = cookingTime || recipe.cookingTime;
        recipe.image = image || recipe.image;
        recipe.tags = tags || recipe.tags;
        recipe.is_published = is_published ?? recipe.is_published;
        recipe.cuisine = cuisine || recipe.cuisine;
        recipe.nutrition = nutrition || recipe.nutrition;
        recipe.diet = diet || recipe.diet;
        recipe.type = type || recipe.type;
        recipe.difficulty = difficulty || recipe.difficulty;
        recipe.servings = servings || recipe.servings;

        await recipe.save();
        return res.status(200).json({ message: "Рецепт оновлено", recipe });
      }

      // PATCH — опублікувати рецепт
      if (req.method === "PATCH") {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ message: "Рецепт не знайдено" });
        }
        if (recipe.author.toString() !== session.user.id) {
          return res.status(403).json({ message: "Немає прав доступу" });
        }
        recipe.is_published = true;
        await recipe.save();
        return res.status(200).json({ message: "Рецепт опубліковано" });
      }

      // DELETE — видалити рецепт
      if (req.method === "DELETE") {
        const recipe = await Recipe.findById(id);
        if (!recipe) {
          return res.status(404).json({ message: "Рецепт не знайдено" });
        }
        if (recipe.author.toString() !== session.user.id) {
          return res.status(403).json({ message: "Немає прав доступу" });
        }
        await recipe.deleteOne();
        return res.status(200).json({ message: "Рецепт видалено" });
      }

      res.setHeader("Allow", ["GET", "PUT", "PATCH", "DELETE"]);
      return res
        .status(405)
        .json({ message: `Метод ${req.method} не дозволений` });
    } catch (error) {
      console.error("Error in /api/recipes/[id]:", error);
      return res
        .status(500)
        .json({ message: "Внутрішня помилка сервера", error: error.message });
    }
  });
}
