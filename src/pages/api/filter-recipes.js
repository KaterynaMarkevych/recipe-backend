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
        limit,
        page,
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
          "ingredients.name": {
            $not: {
              $in: excludeIngredients
                .split(/[,\s]+/) // розділяє і за комами, і за пробілами
                .filter(Boolean)
                .map((ing) => new RegExp(ing.trim(), "i")),
            },
          },
        }),
        is_published: true,
      };
      if (searchTerm) {
        const terms = searchTerm
          .split(" ")
          .map((s) => s.trim())
          .filter(Boolean);

        filter.$or = [
          {
            title: {
              $regex: new RegExp(searchTerm, "i"), // вся фраза в назві
            },
          },
          {
            "ingredients.name": {
              $all: terms.map((term) => new RegExp(term, "i")), // всі слова в інгредієнтах
            },
          },
        ];
      }

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

      // Параметри пагінації
      const limitNum = limit ? parseInt(limit) : 0; // 0 = без ліміту
      const pageNum = page ? parseInt(page) : 1;
      const skip = limitNum > 0 ? (pageNum - 1) * limitNum : 0;

      // Отримання рецептів з фільтрацією, сортуванням та пагінацією
      const query = Recipe.find(filter).sort(sortObj);

      // Застосовуємо пагінацію, якщо вказаний ліміт
      if (limitNum > 0) {
        query.skip(skip).limit(limitNum);
      }

      const recipes = await query.exec();

      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Помилка при отриманні рецептів", error });
    }
  });
}
