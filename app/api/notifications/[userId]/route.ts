import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

interface IParams {
  userId: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid id");
    }

    const notifications = await prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        hasNotifications: false,
      },
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
