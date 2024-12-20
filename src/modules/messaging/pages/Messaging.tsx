import { useEffect } from "react";
import { MessagingGroupsCard } from "../components/groups-card";
import { ActiveComponentProvider, useActiveComponentContext } from "../context";
import { auth } from "@/app/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useSearchParams } from "react-router-dom";
import { BeauticiansGroupCard } from "../components/Groups/beauticians-group-card";
import { useGetUsersQuery } from "@/modules/users/api/usersApi";
import { useUserMetrics } from "@/modules/users/hooks/useUserMetrics";
import { TausiUser } from "@/models/user";
import { ClientsGroupCard } from "../components/Groups/clients-group-card";
// import { useGetProfessionalsQuery } from "@/modules/applications/api/professionalApi";

interface RightSideContentProps {
  activeComponent: any;
}

const RightSideContent: React.FC<RightSideContentProps> = ({
  activeComponent,
}) => {
  return (
    <div className="w-2/3">
      <div className="relative flex justify-center h-[88vh]">
        <div className="fixed h-[80vh] w-[50%] px-4 flex flex-col justify-between">
          {activeComponent}
        </div>
      </div>
    </div>
  );
};

const MessagingContent = () => {
  const { activeComponent, changeActiveComponent } =
    useActiveComponentContext();
  const [searchParams] = useSearchParams();
  const { data: users, isLoading, error } = useGetUsersQuery(10000);
  // const {data, } = useGetProfessionalsQuery(10000);
  const userMetrics = useUserMetrics(users);

  // const beauticians = data?.data || [];
  const beauticians =
    users?.filter(
      (user: TausiUser) => user.sessionData?.userTypeSession === "professional"
    ) || [];
  const clients =
    users?.filter(
      (user: TausiUser) => user.sessionData?.userTypeSession === "client"
    ) || [];

  useEffect(() => {
    const activeComponentId = searchParams.get("activeComponent");
    if (activeComponentId === "professionals-group") {
      changeActiveComponent(
        <BeauticiansGroupCard
          data={beauticians}
          isLoading={isLoading}
          error={error}
        />,
        "professionals-group"
      );
    } else if (activeComponentId === "clients-group") {
      changeActiveComponent(
        <ClientsGroupCard data={clients} isLoading={isLoading} error={error} />,
        "clients-group"
      );
    }
  }, [searchParams]);

  return (
    <div className={`px-6 flex md:flex-row flex-col w-full gap-3`}>
      {/* LEFT SIDE */}
      <div
        className={`transition-all duration-600 ${
          !activeComponent ? "w-full flex md:px-6 px-2" : "w-1/3 space-y-4"
        }`}
      >
        <MessagingGroupsCard
          beauticians={beauticians}
          clients={clients}
          userMetrics={userMetrics}
          isLoading={isLoading}
          error={error}
        />
      </div>
      {/* RIGHT SIDE */}
      {activeComponent && (
        <RightSideContent activeComponent={activeComponent} />
      )}
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
