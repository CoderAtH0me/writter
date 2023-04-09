import axios from "axios";
import useSWR from "swr";

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const useMessages = (userId: string, page: number, limit: number) => {
  const fetchMessages = async (key: string): Promise<Message[]> => {
    const [url, page, limit] = key.split("|");
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    try {
      const response = await axios.get(url, {
        params: {
          _page: pageNum,
          _limit: limitNum,
          _sort: "createdAt",
          _order: "desc",
        },
      });

      // If this is not the first page, append new messages to existing ones.
      if (pageNum > 1 && data) {
        return [...data, ...response.data];
      }

      return response.data;
    } catch (error) {
      throw new Error("Error fetching messages.");
    }
  };

  const { data, error, mutate } = useSWR(
    userId ? `/api/messages/${userId}|${page}|${limit}` : null,
    fetchMessages,
    {
      onSuccess: (newData, key) => {
        const [, newPage] = key.split("|");
        const pageNum = parseInt(newPage);

        if (pageNum > 1) {
          mutate((oldData: Message[] | undefined) => {
            if (oldData) {
              const uniqueMessageIds = new Set(
                oldData.map((message) => message.id)
              );
              const filteredNewData = newData.filter(
                (message) => !uniqueMessageIds.has(message.id)
              );
              return [...oldData, ...filteredNewData];
            } else {
              return newData;
            }
          }, false);
        }
      },

      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
  };
};

export default useMessages;
