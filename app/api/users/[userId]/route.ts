import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

interface IParams {
  userId?: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { userId } = params;

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid Id");
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    const followersCount = await prisma.user.count({
      where: {
        followingIds: {
          has: userId,
        },
      },
    });

    return NextResponse.json({ ...existingUser, followersCount });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
