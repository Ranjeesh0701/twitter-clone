import { NextResponse } from "next/server";
import serverAuth from "@/libs/serverAuth";

export async function GET(req: Request) {
  try {
    const { currentUser } = await serverAuth();
    return NextResponse.json(currentUser);
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}
