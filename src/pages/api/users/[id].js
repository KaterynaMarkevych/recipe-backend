// api/users/[id].js
import { connectToDatabase } from "../../../lib/mongodb";
import User from "../../../../src/models/User";
import { runCors } from "../../../lib/cors";

export default async function handler(req, res) {
  const { id } = req.query; // Отримуємо ID користувача з URL параметра
  runCors(req, res, async () => {
    try {
      await connectToDatabase(); // Підключення до бази даних
      const user = await User.findById(id); // Отримання користувача за ID

      if (!user) {
        return res.status(404).json({ message: "Користувача не знайдено" });
      }

      res.status(200).json(user); // Повертаємо дані користувача
    } catch (error) {
      console.error("Помилка при отриманні користувача:", error);
      res.status(500).json({ message: "Помилка при отриманні користувача" });
    }
  });
}
