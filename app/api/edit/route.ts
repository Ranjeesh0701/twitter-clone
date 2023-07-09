import useCurrentUser from "@/hooks/useCurrentUser";
import serverAuth from "@/libs/serverAuth";
import { NextResponse } from "next/server";

import prisma from "@/libs/prismaDB";

export async function PATCH(req: Request) {
  try {
    const { currentUser } = await serverAuth();
    const { name, username, bio, profileImage, coverImage } = await req.json();

    if (!name || !username) {
      throw new Error("Missing required fields");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        username,
        bio,
        profileImage,
        coverImage,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
