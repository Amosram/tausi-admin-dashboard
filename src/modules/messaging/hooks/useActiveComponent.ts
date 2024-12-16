import { useState } from "react";

export const useActiveComponent = () => {
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);

  const changeActiveComponent = (component: React.ReactNode) => {
    setActiveComponent(component);
  };

  return { activeComponent, changeActiveComponent };
};
