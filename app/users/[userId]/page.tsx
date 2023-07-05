"use client";

import Header from "@/components/Header";
import { PostFeed } from "@/components/posts/PostFeed";
import UserBio from "@/components/users/UserBio";
import UserHero from "@/components/users/UserHero";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

interface IParams {
  userId: string;
}

const UserView = ({ params }: { params: IParams }) => {
  const router = useRouter();
  const userId = params?.userId;
  const { data: fetchedUser, isLoading } = useUser(userId as string);
  if (isLoading || !fetchedUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color="lightblue" size={80} />
      </div>
    );
  }

  return (
    <>
      <Header showBackArrow label={fetchedUser?.name} />
      <UserHero userId={userId as string} />
      <UserBio userId={userId as string} />
      <PostFeed userId={userId as string} />
    </>
  );
};

export default UserView;
