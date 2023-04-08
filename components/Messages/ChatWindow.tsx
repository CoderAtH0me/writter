import axios from "axios";
import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

import {
  BsArrowLeftShort,
  BsArrowRightShort,
  BsFillSendFill,
} from "react-icons/bs";

import useUser from "@/hooks/useUser";
import useMessages from "@/hooks/useMessages";
import useCurrentUser from "@/hooks/useCurrentUser";

import Avatar from "../Avatar";
import Input from "../Input";
import Button from "../Button";

interface ChatWindowProps {
  userId: string;
  showConversations: boolean;
  setShowConversations: (value: boolean) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  userId,
  showConversations,
  setShowConversations,
}) => {
  const { data: currentUser } = useCurrentUser();

  const { data: user, isLoading: isLoadingUser } = useUser(userId);

  const { data: messages = [], mutate: mutateMessages } = useMessages(userId);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    try {
      setIsLoading(true);

      await axios.post(`/api/messages/${userId}`, {
        content: message,
        recipientId: userId,
      });

      toast.success("Message sent");

      setMessage("");
      setIsLoading(false);
      mutateMessages(); // Update the messages after sending a new one
    } catch (err) {
      toast.error("Error sending message");
      setIsLoading(false);
    }
  }, [message, userId, mutateMessages]);

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-md 
        m-2
        w-full
        `}
    >
      <h2 className="text-white text-xl border-b-[1px] border-neutral-800 p-2 md:p-4">
        {!isLoadingUser && user ? (
          <>
            <div className="flex flex-row gap-2 justify-between items-center">
              <Button
                onClick={() => setShowConversations(!showConversations)}
                label={
                  showConversations ? (
                    <BsArrowLeftShort />
                  ) : (
                    <BsArrowRightShort />
                  )
                }
                noBorder
                outline
                notRounded={true}
                transform={true}
              />
              {user.name}
              <Avatar userId={userId} />
            </div>
          </>
        ) : (
          "Chat Window"
        )}
      </h2>
      <div className="px-4 mt-4 flex-grow overflow-y-auto border-b-[1px] border-neutral-800">
        {messages
          .filter(
            (message: Record<string, any>) => message.content.trim() !== ""
          )
          .map((message: Record<string, any>, index: number) => {
            const isOwnMessage =
              currentUser && message.senderId === currentUser.id;

            return (
              <div
                key={index}
                className={`flex flex-row gap-4 mb-4 ${
                  isOwnMessage ? "justify-end" : ""
                }`}
              >
                <div
                  className={`flex flex-col ${
                    isOwnMessage ? "items-end text-right" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-md ${
                      isOwnMessage
                        ? "bg-neutral-700 text-white"
                        : "bg-neutral-800 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div
        className="
              mt-1 md:mt-4 
              flex 
              flex-row 
              gap-1 md:gap-4
              items-center 
              px-1 md:px-4 
              pb-1 md:pb-4
              "
      >
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <Button
          onClick={sendMessage}
          disabled={message.trim().length === 0 || isLoading}
          label={<BsFillSendFill />}
          notRounded={true}
          large
        />
      </div>
    </div>
  );
};

export default ChatWindow;
