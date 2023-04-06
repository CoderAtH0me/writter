import { useRouter } from "next/router";
import { ClipLoader } from "react-spinners";

import Header from "@/components/Header";
import UserHero from "@/components/users/UserHero";
import UserBio from "@/components/users/UserBio";
import PostFeed from "@/components/posts/PostFeed";
import FollowListModal from "@/components/modals/FollowListModal";

import useUser from "@/hooks/useUser";
import useFollowListModal from "@/hooks/useFollowListModal";

const UserView = () => {
  const router = useRouter();
  const { userId } = router.query;

  const { data: fetchedUser, isLoading } = useUser(userId as string);

  const followModal = useFollowListModal();
  const title =
    followModal.listType === "followers" ? "Followers List" : "Following List";
  const users =
    followModal.listType === "followers"
      ? fetchedUser?.followers
      : fetchedUser?.following;

  if (isLoading || !fetchedUser) {
    return (
      <div
        className="
        flex
        justify-center
        items-center
        h-full
      "
      >
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
      <FollowListModal
        isOpen={followModal.isOpen}
        title={title}
        actionLabel="OK"
        users={users}
        onClose={followModal.onClose}
      />
    </>
  );
};

export default UserView;
