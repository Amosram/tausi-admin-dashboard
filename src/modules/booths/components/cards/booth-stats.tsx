import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Booth } from "@/models";
import { Building2, Wrench, CheckCircle2, Users, XCircle, PieChart } from "lucide-react";
import { Link } from "react-router-dom";
import { useBoothMetrics } from "../../hooks/useBoothMetrics";

interface BoothsStatsProps {
  booths: Booth[];
}

export const BoothStats = ({ booths }: BoothsStatsProps) => {
  const {
    totalBooths,
    boothsUnderMaintenance,
    boothsFullyOccupied,
    boothsPartiallyOccupied,
    boothsEmpty,
    boothsUnassigned,
    boothsAssigned,
    activeBooths,
    percentageOccupancy,
    percentageUnderMaintenance,
  } = useBoothMetrics(booths);

  const statsItems = [
    {
      icon: <Building2 className="h-8 w-8 text-blue-600" />,
      label: "Total Booths",
      value: totalBooths,
      link: "/booths/list",
      filter: null,
      bgColor: "bg-blue-50",
      textColor: "text-blue-800",
    },
    {
      icon: <Wrench className="h-8 w-8 text-yellow-600" />,
      label: "Maintenance",
      value: `${boothsUnderMaintenance} (${percentageUnderMaintenance.toFixed(1)}%)`,
      link: "/booths/list",
      filter: "maintenance",
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
    },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-green-600" />,
      label: "Fully Occupied",
      value: boothsFullyOccupied,
      link: "/booths/list",
      filter: "fully-occupied",
      bgColor: "bg-green-50",
      textColor: "text-green-800",
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      label: "Partially Occupied",
      value: boothsPartiallyOccupied,
      link: "/booths/list",
      filter: "partially-occupied",
      bgColor: "bg-purple-50",
      textColor: "text-purple-800",
    },
    {
      icon: <XCircle className="h-8 w-8 text-red-600" />,
      label: "Empty Booths",
      value: boothsEmpty,
      link: "/booths/list",
      filter: "empty",
      bgColor: "bg-red-50",
      textColor: "text-red-800",
    },
    // {
    //   icon: <PieChart className="h-8 w-8 text-orange-600" />,
    //   label: "Assigned Booths",
    //   value: boothsAssigned,
    //   link: "/booths/list",
    //   filter: null,
    //   bgColor: "bg-orange-50",
    //   textColor: "text-orange-800",
    // },
    // {
    //   icon: <PieChart className="h-8 w-8 text-gray-600" />,
    //   label: "Unassigned",
    //   value: boothsUnassigned,
    //   link: "/booths/list",
    //   filter: null,
    //   bgColor: "bg-gray-50",
    //   textColor: "text-gray-800",
    // },
    {
      icon: <CheckCircle2 className="h-8 w-8 text-indigo-600" />,
      label: "Active Booths",
      value: activeBooths,
      link: "/booths/list",
      filter: null,
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-800",
    },
  ];

  return (
    <div className="w-full py-4 mx-auto mb-6">
      <p className="text-lg uppercase text-center font-semibold mb-3">STATS</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            {item.link && (
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full text-xs hover:bg-opacity-20 border-opacity-50 transition-colors hover:bg-primary hover:text-white dark:hover:bg-orange-600"
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