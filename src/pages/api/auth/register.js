import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, email, password, avatar, bio } = req.body;

    // Підключення до бази даних
    await connectToDatabase();

    // Перевірка, чи користувач вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Користувач з таким email вже існує." });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const newUser = new User({
      username: name,
      email,
      password: hashedPassword,
      bio,
      avatar,
    });
    await newUser.save();

    // Відправка відповіді
    res.status(201).json({
      message: "Користувач успішно зареєстрований",
      user: {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
      },
    });
  } else {
    res.status(405).json({ message: "Метод не підтримується" });
  }
}
