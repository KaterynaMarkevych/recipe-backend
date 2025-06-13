import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import Wrapper from "@/components/shared/Wrapper/Wrapper";
import ProfilePage from "@/components/ProfilePage/ProfilePage";

export default async function ProfileRoute({ params }) {
  const session = await getServerSession(authOptions); // працює на сервері і автоматично отримає сесію

  if (!session) {
    redirect("/");
  }

  // Опціонально: перевірка, що id збігається з session.user.id
  if (params.id !== session.user.id) {
    redirect("/unauthorized");
  }

  return (
    <main>
      <Wrapper>
        <ProfilePage user={session.user} />;
      </Wrapper>
    </main>
  );
}
