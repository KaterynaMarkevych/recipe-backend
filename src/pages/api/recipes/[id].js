import { connectToDatabase } from "../../../lib/mongodb";
import Recipe from "../../../models/Recipe";
import { runCors } from "../../../lib/cors";
import mongoose from "mongoose";

export default async function handler(req, res) {
  // Викликаємо CORS
  runCors(req, res, async () => {
    try {
      await connectToDatabase(); // Підключення до БД
      const { id } = req.query;
      
      // Перевіряємо, чи ID має правильний формат
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Некоректний ID рецепту" });
      }
      
      // Знаходимо рецепт за ID
      const recipe = await Recipe.findById(id);
      
      if (!recipe) {
        return res.status(404).json({ message: "Рецепт не знайдено" });
      }
      
      res.status(200).json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ 
        message: "Помилка при отриманні рецепту", 
        error: error.message 
      });
    }
  });
} 