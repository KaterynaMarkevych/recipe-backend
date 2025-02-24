import { connectToDatabase } from "../../lib/mongodb";
import User from "../../models/User";

export default async function handler(req, res) {
  await connectToDatabase(); // підключення до бази

  try {
    const users = await User.find({}); // отримання всіх користувачів
    res.status(200).json(users);
  } catch (error) {
    console.error("Помилка при отриманні користувачів:", error);
    res.status(500).json({ message: "Помилка при отриманні користувачів" });
  }
}
