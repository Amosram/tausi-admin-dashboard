import { Professional } from "@/models";
import { BriefcaseBusiness, Star, User, UserRoundCheck, UserRoundX } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetDashboardAnalyticsQuery } from "@/modules/dashboard/api/dashboardApi";
import Loader from "@/components/layout/Loader";


interface BeauticianListStatsProps {
    beauticians: Professional[];
}

const BeauticianListStats = ({beauticians}: BeauticianListStatsProps) => {

  const {data, isLoading, isError} = useGetDashboardAnalyticsQuery('users');

  const formatter = new Intl.NumberFormat('en-US');

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  const statsItems = [
    {
      icon: <User className="h-8 w-8 text-blue-600" />,
      label: "Total Verified Beauticians",
      filter: null,
      value: formatter.format(data.data.verified_professionals),
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      icon: <UserRoundCheck className="h-8 w-8 text-green-600" />,
      label: "Total Active Beauticians",
      filter: "active",
      value: formatter.format(data.data.active_professionals),
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      icon: <UserRoundX className="h-8 w-8 text-red-600" />,
      label: "Total Inactive Beauticians",
      filter: "inactive",
      value: formatter.format(data.data.inactive_professionals),
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    {
      icon: <Star className="h-8 w-8  text-orange-600" />,
      label: "Top Rated Beautician",
      filter: "top-rated",
      value: formatter.format(data.data.top_rated_professionals),
      bgColor: "bg-orange-50",
      textColor: "text-orange-800",
    },
    {
      icon: <BriefcaseBusiness className="h-8 w-8 text-indigo-600" />,
      label: "Total Services Offered",
      filter: "services",
      value: formatter.format(data.data.all_services),
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
    }
    
  ];

  return (
    <div className="w-full p-4 mx-auto">
      <p className="text-lg uppercase text-center font-semibold mb-3">STATS</p>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {statsItems.map((item, index) => (
          <Card
            key={index}
            className="flex flex-col justify-between border-2 border-transparent hover:shadow-xl hover:border-opacity-50 transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 rounded-xl overflow-hidden"
          >
            <CardHeader className="flex flex-row items-center justify-center p-4 pb-2">
              <div className="p-3 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-center flex-grow flex flex-col justify-center">
              <div className="text-2xl font-bold mb-1">{item.value}</div>
              <p className="text-xs opacity-70 uppercase tracking-wider truncate">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BeauticianListStats;
