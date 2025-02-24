import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/User";
import { runCors } from "../../lib/cors";

export default async function handler(req, res) {
  runCors(req, res, async () => {
    try {
      await connectToDatabase(); // підключення до бази
      const users = await User.find({}); // отримання всіх користувачів
      res.status(200).json(users);
    } catch (error) {
      console.error("Помилка при отриманні користувачів:", error);
      res.status(500).json({ message: "Помилка при отриманні користувачів" });
    }
  });
}
