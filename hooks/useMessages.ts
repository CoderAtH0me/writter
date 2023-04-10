import useSWR from "swr";
import fetcher from "@/libs/fetcher";

const useMessages = (userId: string) => {
  const url = userId ? `/api/messages/${userId}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

export default useMessages;
