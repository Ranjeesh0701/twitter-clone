import serverAuth from "@/libs/serverAuth";
import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid id");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Invalid id");
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    updatedFollowingIds.push(userId);

    try {
      await prisma.notification.create({
        data: {
          body: `${currentUser.name} started following you!`,
          userId,
        },
      });

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hasNotifications: true,
        },
      });
    } catch (error) {
      console.log(error);
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");

    const { currentUser } = await serverAuth();

    if (!userId || typeof userId !== "string") {
      throw new Error("Invalid id");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("Invalid id");
    }

    let updatedFollowingIds = [...(user.followingIds || [])];

    updatedFollowingIds = updatedFollowingIds.filter(
      (followingId) => followingId !== userId
    );

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        followingIds: updatedFollowingIds,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
