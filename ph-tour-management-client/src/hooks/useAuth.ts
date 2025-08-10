//

import { useMyInfoQuery } from "@/redux/features/auth/auth.api";

export default function useAuth() {
  const { data, isLoading, isFetching, isError, error } = useMyInfoQuery(null);

  return {
    user: data?.data || null,
    isLoading,
    isFetching,
    isError,
    error,
  };
}
