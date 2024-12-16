import { BeauticiansCard } from "../components/beauticians-card";
import { ChatCard } from "../components/chat-card";
import { ClientsCard } from "../components/clients-card";
import { GroupsCard } from "../components/groups-card";
import { MessageCard } from "../components/message-card";
import { ActiveComponentProvider, useActiveComponentContext } from "../context";

const RightSideContent = () => {
  const { activeComponent } = useActiveComponentContext();
  return (
    <div className="w-2/3">
      <div className="relative flex justify-center items-center h-[88vh]">
        <div className="fixed h-[80vh] w-[50%] px-4 flex flex-col justify-between">{activeComponent || <ChatCard />}</div>
      </div>
    </div>
  );
};

const Messaging = () => {
  return (
    <ActiveComponentProvider>
      <div className="px-6 flex md:flex-row flex-col w-full gap-3">
        {/* LEFT SIDE */}
        <div className="w-1/3 space-y-4">
          <MessageCard />
          <GroupsCard />
          <BeauticiansCard />
          <ClientsCard />
        </div>
        {/* RIGHT SIDE */}
        <RightSideContent />
      </div>
    </ActiveComponentProvider>
  );
};

export default Messaging;
