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

export function AuthProvider({
  children,
}: AuthProviderProps) {
  
  const token = useToken();
  const updateUser = useUpdateUser();
  const clear = useClearAuth();

  const {
    data,
    isSuccess,
    isError,
  } = useMe(!!token);

  useEffect(() => {
    if (token && isSuccess && data) {
      updateUser(data);
    }
  }, [
    token,
    isSuccess,
    data,
    updateUser,
  ]);

  useEffect(() => {
    if (token && isError) {
      clear();
    }
  }, [
    token,
    isError,
    clear,
  ]);
  return <>{children}</>;
}