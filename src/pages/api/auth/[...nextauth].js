import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcryptjs";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Підключення до бази даних
        await connectToDatabase();

        const user = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error("Невірний email або пароль");
        }

        // Перевірка пароля
        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) {
          throw new Error("Невірний email або пароль");
        }

        return user; // Повертаємо об'єкт користувача, якщо автентифікація пройшла
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, //шифрувати сесію і токени безпечно
  pages: {
    signIn: "/auth/signin", // налаштуйте свою сторінку для входу
    error: "/auth/error", // якщо виникає помилка, переадресовуємо сюди
  },
  session: {
    jwt: true, // Використовувати JWT для сесій
  },
  callbacks: {
    async jwt({ token, user }) {
      // Додавання додаткової інформації до токена, якщо потрібно
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Додавання додаткової інформації до сесії
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
