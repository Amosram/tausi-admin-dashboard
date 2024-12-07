import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useBoothMetrics } from "@/hooks/useBoothMetrics";
import { Booth } from "@/models";
import {
  Building2,
  Wrench,
  CheckCircle2,
  Users,
  XCircle,
  PieChart,
} from "lucide-react";
import { Link } from "react-router-dom";

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
      icon: <Building2 className="h-6 w-6 text-blue-500" />,
      label: "Total Booths",
      value: totalBooths,
      link: "/booths/list",
      filter: null,
    },
    {
      icon: <Wrench className="h-6 w-6 text-yellow-500" />,
      label: "Booths Under Maintenance",
      value: `${boothsUnderMaintenance} (${percentageUnderMaintenance.toFixed(
        1
      )}%)`,
      link: "/booths/list",
      filter: "maintenance",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-500" />,
      label: "Fully Occupied Booths",
      value: boothsFullyOccupied,
      link: "/booths/list",
      filter: "fully-occupied",
    },
    {
      icon: <Users className="h-6 w-6 text-purple-500" />,
      label: "Partially Occupied Booths",
      value: boothsPartiallyOccupied,
      link: "/booths/list",
      filter: "partially-occupied",
    },
    {
      icon: <XCircle className="h-6 w-6 text-red-500" />,
      label: "Empty Booths",
      value: boothsEmpty,
      link: "/booths/list",
      filter: "empty",
    },
    {
      icon: <PieChart className="h-6 w-6 text-orange-500" />,
      label: "Assigned Booths",
      value: boothsAssigned,
      link: "/booths/list",
      filter: null,
    },
    {
      icon: <PieChart className="h-6 w-6 text-gray-500" />,
      label: "Unassigned Booths",
      value: boothsUnassigned,
      link: "/booths/list",
      filter: null,
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-green-700" />,
      label: "Active Booths",
      value: activeBooths,
      link: "/booths/list",
      filter: null,
    },
  ];

  return (
    <div className="flex flex-wrap w-full justify-between py-2 px-4">
      {statsItems.map((item, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow duration-300 w-[33%] mb-4"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </CardContent>
          {item.link && (
            <CardFooter>
              <Button asChild>
                <Link
                  to={{
                    pathname: item.link,
                    search: item.filter ? `?filter=${item.filter}` : "",
                  }}
                >
                  View
                </Link>
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};
