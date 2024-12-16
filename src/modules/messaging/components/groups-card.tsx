import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import { useActiveComponentContext } from "../context";
import { MessagingChatCard as ChatCard } from "../components/chat-card";
import { BeauticiansGroupCard } from "./Groups/beauticians-group-card";
import { useGetUsersQuery } from "@/modules/users/api/usersApi";
import { useUserMetrics } from "@/modules/users/hooks/useUserMetrics";
import { ClientsGroupCard } from "./Groups/clients-group-card";
import { TausiUser } from "@/models/user";
import { useGetProfessionalsQuery } from "@/modules/applications/api/professionalApi";

export const MessagingGroupsCard = () => {
  const { data: users, isLoading, error } = useGetUsersQuery(10000);
  const {data, } = useGetProfessionalsQuery(10000);
  const userMetrics = useUserMetrics(users);
  const { changeActiveComponent } = useActiveComponentContext();
  const [activeGroupType, setActiveGroupType] = useState<
    "professionals" | "clients"
  >("professionals");

  const beauticians = data?.data || [];
  // const beauticians =
  //   users?.filter(
  //     (user: TausiUser) => user.sessionData?.userTypeSession === "professional"
  //   ) || [];
  const clients =
    users?.filter(
      (user: TausiUser) => user.sessionData?.userTypeSession === "client"
    ) || [];

  const handleBulkMessage = (
    groupType: "all" | "professionals" | "clients"
  ) => {
    changeActiveComponent(<ChatCard />);
    // Additional logic for bulk messaging can be added here
  };

  const handleViewMore = (groupType: "professionals" | "clients") => {
    setActiveGroupType(groupType);
    switch (groupType) {
      case "professionals":
        changeActiveComponent(
          <BeauticiansGroupCard
            data={beauticians}
            isLoading={isLoading}
            error={error}
          />
        );
        break;
      case "clients":
        changeActiveComponent(
          <ClientsGroupCard
            data={clients}
            isLoading={isLoading}
            error={error}
          />
        );
        break;
      default:
        changeActiveComponent(<ChatCard />);
    }
  };

  if (isLoading)
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (error)
    return (
      <Card>
        <CardContent>Error loading users</CardContent>
      </Card>
    );

  const groupTypes = [
    {
      name: "Professionals",
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
    <Card>
      <CardHeader>
        <CardTitle>Groups</CardTitle>
        <CardDescription>Select a group to view details</CardDescription>
      </CardHeader>
      <CardContent>
        {groupTypes.map((group, index) => (
          <div
            key={group.type}
            className={`flex justify-between items-center py-4 px-2 rounded-md ${
              index !== 0 ? "border-t border-gray-200" : ""
            } ${activeGroupType === group.type ? "bg-primary-superlight" : ""}`}
          >
            {/* Group Details */}
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 relative">
                  <div className="absolute inset-0 bg-white rounded-full" />
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
              <button
                className="flex items-center gap-2 px-2 py-1 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-xs"
                onClick={() => handleBulkMessage(group.type)}
              >
                <FiMessageSquare size={16} />
                <span>Bulk</span>
              </button>
              <button
                className="flex items-center gap-2 px-2 py-1 text-white bg-primary hover:bg-red-700 rounded-md shadow-sm text-xs"
                onClick={() => handleViewMore(group.type)}
              >
                <FiEye size={16} />
                <span>More</span>
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
