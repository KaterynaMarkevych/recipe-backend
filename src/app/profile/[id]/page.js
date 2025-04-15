import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import ProfilePage from "@/components/ProfilePage/ProfilePage";

export default async function ProfileRoute({ params }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Опціонально: перевірка, що id збігається з session.user.id
  if (params.id !== session.user.id) {
    redirect("/unauthorized");
  }

  return <ProfilePage user={session.user} />;
}
