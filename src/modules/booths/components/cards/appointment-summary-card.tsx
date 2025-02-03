import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, BarChart3, RefreshCcw } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import Loader from "@/components/layout/Loader";

interface DatePickerProps {
  value: string | null;
  onChange: (date: string | null) => void;
  label: string;
}

export const AppointmentsSummaryCard = ({
  isAppointmentsLoading,
  appointmentTotalsData,
  activeTab,
  setActiveTab,
  dateFilter,
  setDateFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  date,
  setDate,
}: {
  isAppointmentsLoading: boolean;
  appointmentTotalsData: {
    data: Array<{
      status: string;
      totalAppointments: number;
      totalAmount: number;
    }>;
  };
  activeTab: string;
  setActiveTab: (tab: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  date: string | null;
  setDate: (date: string | null) => void;
}) => {
  const statusColors = {
    pending: "bg-yellow-50 border-yellow-200",
    completed: "bg-green-50 border-green-200",
    cancelled: "bg-red-50 border-red-200",
    default: "bg-gray-50 border-gray-200",
  };

  const getStatusColor = (status: string) =>
    statusColors[status.toLowerCase() as keyof typeof statusColors] ||
    statusColors.default;

  const DatePickerWithPopover = ({
    value,
    onChange,
    label,
  }: DatePickerProps) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {value ? format(new Date(value), "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={value ? new Date(value) : undefined}
              onSelect={(newDate: Date | undefined) =>
                onChange(newDate ? format(newDate, "yyyy-MM-dd") : null)
              }
              initialFocus
              disabled={(date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  if (isAppointmentsLoading) {
    return <Loader />;
  }

  return (
    <Card className="border rounded-lg shadow-lg">
      <CardHeader className="border-b pb-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 text-gray-600" />
              <CardTitle className="text-xl font-bold">
                Booth Revenue Summary
              </CardTitle>
            </div>
            <CardDescription>
              This is the summary of revenue of a booth
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={() => {
              setActiveTab("range");
              setDateFilter("all-time");
              setStartDate(null);
              setEndDate(null);
              setDate(null);
            }}
          >
            <RefreshCcw className="h-4 w-4" />
            <span>Reset Filters</span>
          </Button>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={(value) => {
            setActiveTab(value);
            setDateFilter("all-time");
            setStartDate(null);
            setEndDate(null);
            setDate(null);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2 mx-auto">
            <TabsTrigger value="range" className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Date Range</span>
            </TabsTrigger>
            <TabsTrigger
              value="specific"
              className="flex items-center space-x-2"
            >
              <CalendarIcon className="h-4 w-4" />
              <span>Specific Date</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="range" className="mt-4">
            <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DatePickerWithPopover
                    value={startDate}
                    onChange={setStartDate}
                    label="Start Date"
                  />
                  <DatePickerWithPopover
                    value={endDate}
                    onChange={setEndDate}
                    label="End Date"
                  />
                </div>
              </div>
              <div className="w-full md:w-64">
                <Select
                  value={dateFilter}
                  onValueChange={(value) => {
                    setDateFilter(value);
                    setStartDate(null);
                    setEndDate(null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quick Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all-time">All Time</SelectItem>
                    <SelectItem value="1-week">Last Week</SelectItem>
                    <SelectItem value="1-month">Last Month</SelectItem>
                    <SelectItem value="6-months">Last 6 Months</SelectItem>
                    <SelectItem value="1-year">Last Year</SelectItem>
                    <SelectItem value="10-years">Last 10 Years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="specific" className="mt-4">
            <div className="max-w-xs mx-auto">
              <DatePickerWithPopover
                value={date}
                onChange={setDate}
                label="Select Date"
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>

      <CardContent className="p-6">
        {isAppointmentsLoading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : !appointmentTotalsData?.data?.length ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              No appointment data available
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {appointmentTotalsData.data.map((appointment) => (
              <div
                key={appointment.status}
                className={`border rounded-xl p-6 transition-all duration-200 hover:shadow-md ${getStatusColor(
                  appointment.status
                )}`}
              >
                <h3 className="text-lg font-semibold capitalize mb-3 text-gray-800">
                  {appointment.status}
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Appointments</span>
                    <span className="text-xl font-bold text-gray-900">
                      {appointment.totalAppointments}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Revenue</span>
                    <span className="text-xl font-bold text-gray-900">
                      KSH {appointment.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
