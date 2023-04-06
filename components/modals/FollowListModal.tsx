import { useCallback } from "react";
import { useRouter } from "next/router";

import Avatar from "../Avatar";
import Modal from "../Modal";

interface FollowListModalProps {
  isOpen: boolean;
  title: string;
  actionLabel: string;
  users: any[];
  onClose: () => void;
}

const FollowListModal: React.FC<FollowListModalProps> = ({
  isOpen,
  title,
  actionLabel,
  users,
  onClose,
}) => {
  const router = useRouter();

  const handleClick = useCallback(
    (event: any, userId: any) => {
      event.stopPropagation();

      const url = `/users/${userId}`;

      onClose();

      router.push(url);
    },
    [router, onClose]
  );

  const bodyContent = (
    <div>
      <div className=" border-[1px] border-neutral-900">
        <div className="flex flex-col  ">
          {users.map((user: Record<string, any>) => (
            <div
              key={user.id}
              onClick={(event) => handleClick(event, user.id)}
              className="
              flex 
              flex-row 
              gap-4 
              p-3 
              border-b-[1px]
              border-neutral-900
              hover:bg-neutral-900
              cursor-pointer
              "
            >
              <Avatar userId={user.id} />
              <div className="flex flex-col">
                <p
                  className="
               text-white 
                font-semibold 
                text-sm"
                >
                  {user.name}
                </p>
                <p className="text-neutral-400 text-sm">@{user.username}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      actionLabel={actionLabel}
      onSubmit={onClose}
      onClose={onClose}
      body={bodyContent}
    />
  );
};

export default FollowListModal;
