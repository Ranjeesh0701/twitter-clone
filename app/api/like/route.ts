import { NextResponse } from "next/server";

import serverAuth from "@/libs/serverAuth";
import prisma from "@/libs/prismaDB";

export async function POST(req: Request) {
  try {
    const { postId } = await req.json();

    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid id");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Invalid id");
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    updatedLikedIds.push(currentUser.id);

    try {
      const post = await prisma.post.findUnique({
        where: {
          id: postId,
        },
      });

      if (post?.userId) {
        await prisma.notification.create({
          data: {
            body: `${currentUser.name} liked your tweet!`,
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

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const postId = searchParams.get("postId");

    const { currentUser } = await serverAuth();

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid id");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new Error("Invalid id");
    }

    let updatedLikedIds = [...(post.likedIds || [])];

    updatedLikedIds = updatedLikedIds.filter(
      (likedId) => likedId !== currentUser.id
    );

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        likedIds: updatedLikedIds,
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
