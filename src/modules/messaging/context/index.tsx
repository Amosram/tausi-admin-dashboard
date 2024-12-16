import React, { createContext, useContext } from "react";
import { useActiveComponent } from "../hooks/useActiveComponent";

type ActiveComponentContextType = {
  activeComponent: React.ReactNode;
  changeActiveComponent: (component: React.ReactNode) => void;
};

const ActiveComponentContext = createContext<ActiveComponentContextType | undefined>(undefined);

export const ActiveComponentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeComponent, changeActiveComponent } = useActiveComponent();

  return (
    <ActiveComponentContext.Provider value={{ activeComponent, changeActiveComponent }}>
      {children}
    </ActiveComponentContext.Provider>
  );
};

export const useActiveComponentContext = () => {
  const context = useContext(ActiveComponentContext);
  if (!context) {
    throw new Error("useActiveComponentContext must be used within ActiveComponentProvider");
  }
  return context;
};
