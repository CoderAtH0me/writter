import axios from "axios";
import React, { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

import useMessages from "@/hooks/useMessages";
import useCurrentUser from "@/hooks/useCurrentUser";
import Input from "../Input";
import Button from "../Button";

interface ChatWindowProps {
  userId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userId }) => {
  const { data: currentUser } = useCurrentUser();

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
    <div className="bg-neutral-800 rounded-md mt-2 mb-2 mr-2">
      <h2 className="text-white text-xl font-semibold border-b-[1px] border-neutral-700 p-4 px-4">
        Chat Window
      </h2>
      <div className="px-4 mt-4 flex-grow overflow-y-auto border-b-[1px] border-neutral-700">
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
                        ? "bg-blue-600 text-white"
                        : "bg-neutral-700 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="mt-4 flex flex-row gap-4 items-center px-4 pb-4">
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
          label="Send"
          notRounded={true}
          large
        />
      </div>
    </div>
  );
};

export default ChatWindow;
