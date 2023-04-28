import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useConversations from "@/hooks/useConversations";

import Avatar from "../Avatar";

interface ConversationsProps {
  onUserSelect: (userId: string) => void;
  show: boolean;
}

const Conversations: React.FC<ConversationsProps> = ({
  onUserSelect,

  show,
}) => {
  const {
    data: conversations,
    isLoading,
    isError,
    mutate,
  } = useConversations();

  const router = useRouter();
  const selectedUser = router.query.selectedUser as string;

  const [activeConversation, setActiveConversation] = useState(selectedUser);

  const handleUserSelect = (userId: string) => {
    onUserSelect(userId);
    setActiveConversation(userId);
  };

  useEffect(() => {
    if (selectedUser) {
      setActiveConversation(selectedUser);
      mutate();
    }
  }, [selectedUser, mutate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !conversations) {
    return <div>Error loading conversations</div>;
  }

  if (conversations.length === 0) {
    return <div>No conversations yet</div>;
  }

  return (
    <div
      className={`
      pt-2
      pb-2
      pl-2 
      transform 
      transition-all 
      duration-300 
      ease-in-out
      scrollbar
      overflow-y-auto
      overflow-x-hidden
      
      ${show ? "translate-x-0" : "-translate-x-full relative z-2"}
      `}
    >
      <div className="bg-neutral-900 h-[70vh] rounded-md">
        <div className="border-b-[1px] border-neutral-800">
          <h2 className="text-white text-xl font-semibold p-7">Chats</h2>
        </div>
        <div className="flex flex-col">
          {conversations.map((user: Record<string, any>, index: number) => {
            const isActive = activeConversation === user.id;
            return (
              <div
                key={user.id}
                className={`
                flex 
                flex-col 
                md:flex-row 
                items-center 
                gap-2 md:gap-4 
                cursor-pointer 
                p-3 md:p-6 
                border-b-[1px] 
                border-neutral-800 
                h-[20%] 
                ${isActive ? "bg-neutral-700" : "hover:bg-neutral-800"}`}
                onClick={() => handleUserSelect(user.id)}
                style={{
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                  borderBottomLeftRadius:
                    index === conversations.length - 1 ? "0.375rem" : 0,
                  borderBottomRightRadius:
                    index === conversations.length - 1 ? "0.375rem" : 0,
                }}
              >
                <div>
                  <Avatar userId={user.id} useDefaultClick={false} />
                </div>
                <div className="text-white">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-neutral-400 text-sm hidden md:block">
                    @{user.username}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
