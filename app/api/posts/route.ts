import serverAuth from "@/libs/serverAuth";
import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = new URLSearchParams(url.search);
    const userId = searchParams.get("userId");
    let posts;

    if (userId && typeof userId === "string") {
      posts = await prisma.post.findMany({
        where: {
          userId: userId,
        },
        include: {
          user: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      posts = await prisma.post.findMany({
        include: {
          user: true,
          comments: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}

export async function POST(req: Request) {
  try {
    const { currentUser } = await serverAuth();

    const { body } = await req.json();

    const post = await prisma.post.create({
      data: { body, userId: currentUser.id },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
}
