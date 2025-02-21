import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    res.status(200).json({ message: "MongoDB підключено успішно!" });
  } catch (error) {
    res.status(500).json({ message: "Помилка підключення до MongoDB", error });
  }
}
