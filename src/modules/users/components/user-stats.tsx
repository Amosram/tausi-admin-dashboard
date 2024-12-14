import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { CheckCircle2, Users, XCircle, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { TausiUser } from "@/models/user";
import { useUserMetrics } from "../hooks/useUserMetrics";

interface UsersStatsProps {
  users: TausiUser[];
}

export const UserStats = ({ users }: UsersStatsProps) => {
  const {
    totalUsers,
    activeUsers,
    inactiveUsers,
    verifiedUsers,
    unverifiedUsers,
    percentageVerified,
    professionalMetrics: {
      totalProfessionals,
      verifiedProfessionals,
      activeProfessionals,
    },
    clientMetrics: { totalClients, recentlyActiveClients },
  } = useUserMetrics(users);

  const statsItems = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      label: "Total Users",
      value: totalUsers,
      link: "/users/list",
      filter: null,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
      label: "Active Users",
      value: activeUsers,
      link: "/users/list",
      filter: "active",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      icon: <XCircle className="h-8 w-8 text-red-600" />,
      label: "Inactive Users",
      value: inactiveUsers,
      link: "/users/list",
      filter: "inactive",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    {
      icon: <PieChart className="h-8 w-8 text-orange-600" />,
      label: "Verified Users",
      value: `${verifiedUsers} (${percentageVerified.toFixed(1)}%)`,
      link: "/users/list",
      filter: "verified",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
    },
    {
      icon: <PieChart className="h-8 w-8 text-orange-600" />,
      label: "Unverified Users",
      value: `${unverifiedUsers}`,
      link: "/users/list",
      filter: "verified",
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      label: "Total Professionals",
      value: totalProfessionals,
      link: "/users/list",
      filter: "professionals", // Filter for all professionals
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-indigo-600" />,
      label: "Active Professionals",
      value: activeProfessionals,
      link: "/users/list",
      filter: "professionals-active", // Specific filter for active professionals
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
      label: "Verified Professionals",
      value: verifiedProfessionals,
      link: "/users/list",
      filter: "professionals-verified", // Specific filter for verified professionals
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600" />,
      label: "Total Clients",
      value: totalClients,
      link: "/users/list",
      filter: "clients", // Filter for all clients
      bgColor: "bg-teal-50",
      textColor: "text-teal-800",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-gray-600" />,
      label: "Recently Active Clients",
      value: recentlyActiveClients,
      link: "/users/list",
      filter: "clients-recently-active", // Filter for recently active clients
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
    },
    
  ];

  return (
    <div className="w-full p-4 mx-auto">
      <p className="text-lg uppercase text-center font-semibold mb-3 underline">
        User Stats
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {statsItems.map((item, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between border-2 border-transparent hover:shadow-xl hover:border-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 rounded-xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-center p-4 pb-2">
              <div
                className={`p-3 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform ${item.bgColor}`}
              >
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-center flex-grow flex flex-col justify-center">
              <div className={`text-2xl font-bold mb-1 ${item.textColor}`}>
                {item.value}
              </div>
              <p className="text-xs opacity-70 uppercase tracking-wider truncate">
                {item.label}
              </p>
            </CardContent>
            {item.link && (
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full text-xs hover:bg-opacity-20 border-opacity-50 transition-colors hover:bg-primary hover:text-white"
                  asChild
                >
                  <Link
                    to={{
                      pathname: item.link,
                      search: item.filter ? `?filter=${item.filter}` : "",
                    }}
                  >
                    View Details
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
