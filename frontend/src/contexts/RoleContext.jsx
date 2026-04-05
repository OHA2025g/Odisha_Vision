import { createContext, useContext } from "react";

export const RoleContext = createContext(undefined);

export function useRole() {
  const ctx = useContext(RoleContext);
  if (ctx === undefined) {
    throw new Error("useRole must be used within RoleContext.Provider");
  }
  return ctx;
}
