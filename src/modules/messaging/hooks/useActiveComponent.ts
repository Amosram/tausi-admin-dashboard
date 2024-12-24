import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export const useActiveComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeComponent, setActiveComponent] = useState<React.ReactNode>(null);

  const changeActiveComponent = (component: React.ReactNode | null, id?: string) => {
    setActiveComponent(component);

    if (component && id) {
      // Set the search param to the component's ID
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.set("activeComponent", id);
      setSearchParams(newParams);
    } else {
      // Remove the search param if the component is null
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("activeComponent");
      setSearchParams(newParams);
    }
  };

  // useEffect(() => {
  //   // Sync state with URL when the hook is initialized
  //   const activeComponentFromUrl = searchParams.get("activeComponent");
  //   setActiveComponent(activeComponentFromUrl);
  // }, [searchParams]);

  return { activeComponent, changeActiveComponent };
};
