import useUser from "@/hooks/useUser";

interface FollowListModalProps {
  userId: string;
}

const FollowListModal: React.FC<FollowListModalProps> = ({ userId }) => {
  const { data: fetchedUser } = useUser(userId);

  return <div></div>;
};

export default FollowListModal;
