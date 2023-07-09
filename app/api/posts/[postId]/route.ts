import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

interface IParams {
  postId: string;
}

export async function GET(req: Request, { params }: { params: IParams }) {
  try {
    const { postId } = params;

    if (!postId || typeof postId !== "string") {
      throw new Error("Invalid id");
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        user: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
