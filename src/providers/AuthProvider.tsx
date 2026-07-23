/* eslint-disable prettier/prettier */

import { ReactNode, useEffect } from "react";

import { useMe } from "@/hooks";
import {
  useToken,
  useUpdateUser,
  useClearAuth,
} from "@/hooks/useAuth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const token = useToken();
  const updateUser = useUpdateUser();
  const clear = useClearAuth();

  const {
    data,
    isSuccess,
    isError,
  } = useMe(!!token);

  /**
   * Keep the auth store synchronized with the backend.
   */
  useEffect(() => {
    if (!token) return;

    if (isSuccess && data) {
      updateUser(data);
    }
  }, [token, isSuccess, data, updateUser]);

  /**
   * Invalid / expired token.
   */
  useEffect(() => {
    if (!token) return;

    if (isError) {
      clear();
    }
  }, [token, isError, clear]);

  return <>{children}</>;
}