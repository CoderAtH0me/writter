import { NextApiRequest, NextApiResponse } from "next";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).end();
  }

  try {
    const { currentUser } = await serverAuth(req);

    const conversations = await prisma.privateMessage.findMany({
      where: {
        OR: [{ senderId: currentUser.id }, { recipientId: currentUser.id }],
      },
      select: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
        recipient: {
          select: {
            id: true,
            name: true,
            username: true,
            profileImage: true,
          },
        },
      },
    });

    // Remove duplicates and exclude the current user
    const users = Array.from(
      new Map(
        conversations.map((item: any) => {
          const user =
            item.sender.id === currentUser.id ? item.recipient : item.sender;
          return [user.id, user];
        })
      ).values()
    );

    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    return res.status(400).end();
  }
}
