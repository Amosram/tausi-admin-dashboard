import { MessagingGroupsCard } from "../components/groups-card";
import { ActiveComponentProvider, useActiveComponentContext } from "../context";
import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

interface RightSideContentProps {
  activeComponent: any;
}

const RightSideContent: React.FC<RightSideContentProps> = ({ activeComponent }) => {
  return (
    <div className="w-2/3">
      <div className="relative flex justify-center h-[88vh]">
        <div className="fixed h-[80vh] w-[50%] px-4 flex flex-col justify-between">{activeComponent}</div>
      </div>
    </div>
  );
};

// Extracted child component to properly use context
const MessagingContent = () => {
  const { activeComponent } = useActiveComponentContext();

  return (
    <div className={`px-6 flex md:flex-row flex-col w-full gap-3`}>
      {/* LEFT SIDE */}
      <div className={`transition-all duration-300 ${!activeComponent ? "grid grid-cols-1 md:grid-cols-2 gap-2 w-full" : "w-1/3 space-y-4"}`}>
        <MessagingGroupsCard />
      </div>
      {/* RIGHT SIDE */}
      {activeComponent && <RightSideContent activeComponent={activeComponent} />}
    </div>
  );
};

const Messaging = () => {
  const [user] = useAuthState(auth);

  if (!user) {
    return <div>No logged in user found</div>;
  }

  return (
    <ActiveComponentProvider>
      <div className="pt-6">
      <MessagingContent />
      </div>
    </ActiveComponentProvider>
  );
};

export default Messaging;
