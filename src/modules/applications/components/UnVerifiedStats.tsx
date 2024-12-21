import { VerifiedBeauticians } from "@/models";
import { FileCheck, Ban, ListChecks, CircleEllipsis } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useGetDashboardAnalyticsQuery } from "@/modules/dashboard/api/dashboardApi";
import Loader from "@/components/layout/Loader";

interface UnVerifiedBeauticianStatsProps {
  beauticians: VerifiedBeauticians[];
}

const UnVerifiedBeauticianStats = ({ beauticians }: UnVerifiedBeauticianStatsProps) => {

  const {data, isLoading, isError} = useGetDashboardAnalyticsQuery('users');
  
  const formatter = new Intl.NumberFormat('en-US');

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error while fetching data</div>;
  }

  const statsItems = [
    {
      icon: <FileCheck className="h-8 w-8 text-blue-600" />,
      label: "Total Beauticians Applications",
      value: formatter.format(data?.data.data.verifications.total_applications),
      bgColor: "bg-card ",
      textColor: "text-blue-800 dark:text-gray-300",
    },
    {
      icon: <CircleEllipsis className="h-8 w-8 text-green-600" />,
      label: "Pending Applications",
      value: formatter.format(data?.data.data.verifications.pending_applications),
      bgColor: "bg-card ",
      textColor: "text-green-800 dark:text-gray-300",
    },
    {
      icon: <Ban className="h-8 w-8 text-red-600" />,
      label: "Total Rejected Applications",
      value: formatter.format(data?.data.data.verifications.rejected_applications),
      bgColor: "bg-card ",
      textColor: "text-red-800 dark:text-gray-300",
    },
    {
      icon: <ListChecks className="h-8 w-8 text-orange-600" />,
      label: "Applications in Review",
      value: formatter.format(data?.data.data.verifications.applications_under_review),
      bgColor: "bg-card ",
      textColor: "text-orange-800 dark:text-gray-300",
    },
  ];

  return (
    <div className="w-full p-6">
      <p className="text-lg uppercase text-center font-semibold mb-6 text-gray-700 dark:text-gray-300">
        Stats
      </p>
      <div className="grid grid-cols-4 gap-4">
        {statsItems.map((item, index) => (
          <Card
            key={index}
            className={`p-4 flex flex-col items-center justify-between rounded-lg shadow-md border border-gray-200 ${item.bgColor}`}
          >
            <CardHeader className="flex flex-col items-center mb-4">
              <div className={`p-3 rounded-full flex items-center justify-center shadow-md ${item.bgColor}`}>
                {item.icon}
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-2xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
              <p className="text-sm font-medium mt-2 text-gray-600 dark:text-gray-400">
                {item.label}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UnVerifiedBeauticianStats;
