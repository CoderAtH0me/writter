import useSWR from "swr";

import fetcher from "@/libs/fetcher";

export default function useConversations() {
  const { data, error, mutate } = useSWR(
    "/api/messages/conversations",
    fetcher
  );

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
}
