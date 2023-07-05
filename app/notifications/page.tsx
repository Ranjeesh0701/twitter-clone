import Header from "@/components/Header";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

import { getServerSession } from "next-auth/next";
import { Router } from "next/router";
import { redirect } from "next/navigation";
import { NotificationsFeed } from "@/components/notifications/NotificationsFeed";

const Notifications = async () => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <>
      <Header label="Notifications" showBackArrow />
      <NotificationsFeed />
    </>
  );
};

export default Notifications;
