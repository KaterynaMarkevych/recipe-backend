import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthorized" });

  const authUserId = session.user.id;

  await connectToDatabase();

  if (req.method === "GET") {
    const { targetUserId } = req.query;

    if (!targetUserId || authUserId === targetUserId)
      return res.status(400).json({ error: "Invalid request" });

    const authUser = await User.findById(authUserId);
    const isSubscribed = authUser.subscriptions?.includes(targetUserId);
    return res.status(200).json({ isSubscribed });
  }

  if (req.method === "POST") {
    const { targetUserId } = req.body;

    if (!targetUserId || authUserId === targetUserId)
      return res.status(400).json({ error: "Invalid request" });

    const authUser = await User.findById(authUserId);
    const targetUser = await User.findById(targetUserId);

    const isAlreadySubscribed = authUser.subscriptions?.includes(targetUserId);

    if (isAlreadySubscribed) {
      // Відписка
      authUser.subscriptions = authUser.subscriptions.filter(
        (id) => id.toString() !== targetUserId
      );
      targetUser.followers -= 1;
      authUser.following -= 1;
    } else {
      // Підписка
      authUser.subscriptions = [
        ...(authUser.subscriptions || []),
        targetUserId,
      ];
      targetUser.followers += 1;
      authUser.following += 1;
    }

    await authUser.save();
    await targetUser.save();

    return res.status(200).json({ isSubscribed: !isAlreadySubscribed });
  }

  return res.status(405).end();
}
