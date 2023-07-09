import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";
import serverAuth from "@/libs/serverAuth";

export async function POST(req: Request) {
  try {
    const { currentUser } = await serverAuth();
    const { body } = await req.json();

    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const postId = searchParams.get("postId");

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid id");
    }

    const comment = await prisma.comment.create({
      data: {
        body,
        userId: currentUser.id,
        postId,
      },
    });

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: `${currentUser.name} replied to your tweet!`,
            userId: post.userId,
          },
        });

        await prisma.user.update({
          where: {
            id: post.userId,
          },
          data: {
            hasNotifications: true,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }

    return NextResponse.json(comment);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
