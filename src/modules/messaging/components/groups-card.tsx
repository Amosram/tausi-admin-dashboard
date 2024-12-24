import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useActiveComponentContext } from "../context";
import { MessagingChatCard as ChatCard } from "../components/chat-card";
import { BeauticiansGroupCard } from "./Groups/beauticians-group-card";
import {
  UserMetrics,
} from "@/modules/users/hooks/useUserMetrics";
import { ClientsGroupCard } from "./Groups/clients-group-card";
import { TausiUser } from "@/models/user";
import Loader from "@/components/layout/Loader";


interface MessagingGroupsCardProps {
  beauticians: TausiUser[];
  clients: TausiUser[];
  isLoading: boolean;
  error: any;
  userMetrics: UserMetrics;
}

export const MessagingGroupsCard = ({
  beauticians,
  clients,
  isLoading,
  error,
  userMetrics,
}: MessagingGroupsCardProps) => {
  const { changeActiveComponent } = useActiveComponentContext();
  const [activeGroupType, setActiveGroupType] = useState<
    "professionals" | "clients" | ""
  >("");

  const handleViewMore = (groupType: "professionals" | "clients") => {
    setActiveGroupType(groupType);
    switch (groupType) {
      case "professionals":
        changeActiveComponent(
          <BeauticiansGroupCard
            data={beauticians}
            isLoading={isLoading}
            error={error}
          />,
          "professionals-group"
        );
        break;
      case "clients":
        changeActiveComponent(
          <ClientsGroupCard
            data={clients}
            isLoading={isLoading}
            error={error}
          />,
          "clients-group"
        );
        break;
      default:
        changeActiveComponent(<ChatCard />);
    }
  };

  if (isLoading)
    return (
      <Card className="w-full h-[500px] flex justify-center items-center">
        <CardContent><Loader/></CardContent>
      </Card>
    );
  if (error)
    return (
      <Card className="w-full h-[500px] flex justify-center items-center">
        <CardContent>Error loading users</CardContent>
      </Card>
    );

  const groupTypes = [
    {
      name: "Beauticians",
      memberNumber: beauticians.length || 0,
      // memberNumber: userMetrics.professionalMetrics?.totalProfessionals || 0,
      type: "professionals" as const,
    },
    {
      name: "Clients",
      memberNumber: userMetrics.clientMetrics?.totalClients || 0,
      type: "clients" as const,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Groups</CardTitle>
        <CardDescription>Select a group to view details</CardDescription>
      </CardHeader>
      <CardContent>
        {groupTypes.map((group, index) => (
          <div
            key={group.type}
            className={`flex justify-between items-center py-4 md:px-6 px-2 rounded-md ${
              index !== 0 ? "border-t border-gray-200" : ""
            } ${activeGroupType === group.type ? "bg-primary-superlight dark:bg-gray-700" : ""}`}
          >
            {/* Group Details */}
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-white dark:bg-gray-700 rounded-full" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-full" />
                  <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full" />
                </div>
              </div>
              <div>
                <p className="font-semibold">{group.name}</p>
                <p className="text-sm text-gray-500">
                  {group.memberNumber} members
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              {/* Bulk Button */}
              {/* <button
                className="flex items-center gap-2 px-2 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-xs"
                onClick={() => handleBulkMessage(group.type)}
              >
                <FiMessageSquare size={16} />
                <span>Bulk</span>
              </button> */}
              <button
                className="flex items-center gap-2 px-3 py-2 text-white bg-primary hover:bg-red-700 rounded-md shadow-sm text-xs"
                onClick={() => handleViewMore(group.type)}
              >
                <span>View All</span>
              </button>
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p>Total Groups: {groupTypes.length}</p>
      </CardFooter>
    </Card>
  );
};
