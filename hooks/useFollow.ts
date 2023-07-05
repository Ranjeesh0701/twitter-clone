import { useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

import useCurrentUser from "./useCurrentUser";
import useLoginModal from "./useLoginModal";
import useUser from "./useUser";

const useFollow = (userId: string) => {
  const { data: currentUser, mutate: mutateCurrentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(userId);
  const loginModal = useLoginModal();
  const isFollowing = useMemo(() => {
    const list = currentUser?.followingIds || [];
    return list.includes(userId);
  }, [userId, currentUser?.followingIds]);

  const toggleFollow = useCallback(async () => {
    if (!currentUser) {
      return loginModal.onOpen();
    }

    try {
      let request;

      if (isFollowing) {
        request = async () =>
          await axios.delete(`/api/follow?userId=${userId}`);
      } else {
        request = async () => {
          await axios.post("/api/follow", {
            userId,
          });
        };
      }
      await request();
      mutateCurrentUser();
      mutateFetchedUser();

      toast.success("Success!");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  }, [
    currentUser,
    isFollowing,
    mutateCurrentUser,
    mutateFetchedUser,
    userId,
    loginModal,
  ]);

  return {
    isFollowing,
    toggleFollow,
  };
};

export default useFollow;
