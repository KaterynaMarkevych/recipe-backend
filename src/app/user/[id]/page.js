import { Suspense } from "react";
import { connectToDatabase } from "../../../lib/mongodb";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import User from "../../../models/User";
import mongoose from "mongoose";
import dynamic from "next/dynamic";

const AuthorPage = dynamic(
  () => import("../../../components/AuthorPage/AuthorPage"),
  {
    loading: () => (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

async function getUser(id) {
  try {
    await connectToDatabase();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return { error: "Некоректний ID користувача" };
    }

    const user = await User.findById(id);

    if (!user) {
      return { error: "Користувача не знайдено" };
    }
    return { user: JSON.parse(JSON.stringify(user)) };
  } catch (error) {
    console.error("Error fetching user:", error);
    return { error: "Помилка при отриманні користувача" };
  }
}

export default async function UserPage({ params }) {
  const { id } = params;
  const { user, error } = await getUser(id);

  return (
    <main>
      <Wrapper>
        <AuthorPage id={id} initialData={{ user, error }} />
      </Wrapper>
    </main>
  );
}
