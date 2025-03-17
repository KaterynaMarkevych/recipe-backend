import { connectToDatabase } from "../../lib/mongodb";
import Recipe from "../../models/Recipe";
import { runCors } from "../../lib/cors";

export default async function handler(req, res) {
  // Викликаємо CORS
  runCors(req, res, async () => {
    try {
      await connectToDatabase(); // Підключення до БД

      const {
        mealType,
        difficulty,
        diet,
        cookingTime,
        cuisine,
        sort,
        includeIngredients,
        excludeIngredients,
        searchTerm,
      } = req.query;

      // Об'єкт фільтрації
      const filter = {
        ...(mealType && { type: mealType }),
        ...(difficulty && { difficulty }),
        ...(diet && { diet: { $in: diet.split(",") } }),
        ...(cuisine && { cuisine }),
        ...(cookingTime && {
          cookingTime:
            cookingTime === "lessThan30"
              ? { $lt: 30 }
              : cookingTime === "30to60"
              ? { $gte: 30, $lt: 60 }
              : cookingTime === "moreThan60"
              ? { $gte: 60 }
              : undefined,
        }),
        ...(includeIngredients && {
          ingredients: {
            $all: includeIngredients
              .split(",")
              .map((ing) => new RegExp(ing.trim(), "i")),
          },
        }),
        ...(excludeIngredients && {
          ingredients: {
            $not: {
              $elemMatch: {
                $regex: new RegExp(
                  excludeIngredients
                    .split(",")
                    .map((ing) => ing.trim())
                    .join("|"),
                  "i"
                ),
              },
            },
          },
        }),
        ...(searchTerm && {
          name: {
            $regex: new RegExp(
              searchTerm.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&"),
              "i"
            ),
          },
        }),
      };

      // Видаляємо undefined поля, щоб уникнути помилок
      Object.keys(filter).forEach(
        (key) => filter[key] === undefined && delete filter[key]
      );

      // Сортування
      const sortObj =
        sort === "rating"
          ? { rating: -1 }
          : sort === "time"
          ? { cookingTime: 1 }
          : {};

      // Отримання рецептів з фільтрацією та сортуванням
      const recipes = await Recipe.find(filter).sort(sortObj).exec();

      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Помилка при отриманні рецептів", error });
    }
  });
}
