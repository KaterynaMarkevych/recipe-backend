import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import ProfilePage from "@/components/ProfilePage/ProfilePage";

export default async function ProfileRoute({ params }) {
  // Отримуємо параметри асинхронно
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Перевірка доступу користувача
  if (id !== session.user.id) {
    redirect("/unauthorized");
  }

  return (
    <main>
      <Wrapper>
        <ProfilePage user={session.user} />
      </Wrapper>
    </main>
  );
}
