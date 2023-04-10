import axios from "axios";
import React, { useState, useCallback, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";

import { BsFillSendFill } from "react-icons/bs";
import {
  MdOutlineArrowBackIosNew,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

import useUser from "@/hooks/useUser";
import useMessages from "@/hooks/useMessages";
import useCurrentUser from "@/hooks/useCurrentUser";

import Avatar from "../Avatar";
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

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const { data: messages = [], mutate: mutateMessages } = useMessages(
    userId,
    page,
    limit
  );

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [isFetchingMore, setIsFetchingMore] = useState(false);

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
      mutateMessages();
    } catch (err) {
      toast.error("Error sending message");
      setIsLoading(false);
    }
  }, [message, userId, mutateMessages]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const scrollThreshold = 100; // You can adjust this value as needed

    if (
      scrollTop <= scrollThreshold &&
      scrollHeight > clientHeight &&
      !isFetchingMore
    ) {
      setIsFetchingMore(true);
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    if (showConversations && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView();
    }

    if (page > 1) {
      setIsFetchingMore(false);
    }
  }, [messages, page]);

  return (
    <div
      className={`
        bg-neutral-900 
        rounded-md 
        m-2
        w-full
        flex
        flex-col
        justify-between
        
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
                    <MdOutlineArrowBackIosNew />
                  ) : (
                    <MdOutlineArrowForwardIos />
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
      <div
        onScroll={handleScroll}
        ref={scrollContainerRef}
        className="px-4 py-[1px] flex-grow overflow-y-auto border-b-[1px] border-neutral-800 scrollbar"
      >
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
                    className={`px-3 py-2 rounded-full ${
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
        <div ref={messagesEndRef} />
      </div>
      <div
        className="
              flex 
              flex-row 
              gap-2 md:gap-3
              items-center 
              p-2 md:p-3
              "
      >
        <textarea
          disabled={isLoading}
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          onClick={() =>
            showConversations && setShowConversations(!showConversations)
          }
          className="
            custom-textarea
            pl-6
            py-1
            peer
            resize-none
            w-full
            bg-neutral-800
            ring-0
            outline-none
            text-[20px]
            placeholder-neutral-500
            text-white
            rounded-full
            overflow-hide
          "
          placeholder="Type your message..."
        ></textarea>
        <Button
          onClick={sendMessage}
          disabled={message.trim().length === 0 || isLoading}
          label={<BsFillSendFill />}
          notRounded={false}
          large
        />
      </div>
    </div>
  );
};

export default ChatWindow;
