/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";

import { useAuthStore } from "../zustand/authStore";

export const useNavItem = (items: any[]) => {
  const { account } = useAuthStore();

  return useMemo(() => {
    if(!account?.role) return [];

    return items.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(account?.role)
    });

  },[items, account?.role])
};
