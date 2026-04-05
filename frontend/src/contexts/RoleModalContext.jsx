import React, { createContext, useCallback, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import RoleSelectModal from "@/components/RoleSelectModal";

const RoleModalContext = createContext(null);

export function useRoleModal() {
  const ctx = useContext(RoleModalContext);
  if (!ctx) {
    return {
      openRoleModal: () => {},
      closeRoleModal: () => {},
    };
  }
  return ctx;
}

export function RoleModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const { selectRole } = useRole();
  const navigate = useNavigate();

  const openRoleModal = useCallback(() => setOpen(true), []);
  const closeRoleModal = useCallback(() => setOpen(false), []);

  const handleRoleSelect = useCallback(
    (roleId) => {
      selectRole(roleId);
      setOpen(false);
      navigate("/dashboard");
    },
    [selectRole, navigate]
  );

  return (
    <RoleModalContext.Provider value={{ openRoleModal, closeRoleModal }}>
      {children}
      <RoleSelectModal open={open} onClose={closeRoleModal} onSelect={handleRoleSelect} />
    </RoleModalContext.Provider>
  );
}
