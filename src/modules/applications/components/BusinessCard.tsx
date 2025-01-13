import Loader from "@/components/layout/Loader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Professional } from "@/models";
import { useGetAppointmentTotalsQuery } from "@/modules/orders/api/ordersApi";
import { Star } from "lucide-react";
import { ReactNode } from "react";
import { FaMoneyBill } from "react-icons/fa6";

interface InfoFieldProps {
  label: string;
  value: string | ReactNode;
}

const BusinessCard: React.FC<{ professional: Professional}> = ({ professional }) => {

  const beauticianId = professional.id;

  const {
    data: appointmentsTotal,
    isLoading: appointmentsTotalLoading,
    error: appointmentsTotalError,
  } = useGetAppointmentTotalsQuery({beauticianId});

  if (appointmentsTotalLoading) return <Loader/>;
  if (appointmentsTotalError) return <div>Error: Unable to load orders</div>;

  const InfoField: React.FC<InfoFieldProps> = ({ label, value }) => (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      {typeof value === "string" ? (
        <p className="font-medium truncate">{value}</p>
      ) : (
        value
      )}
    </div>
  );


  return(
    <Card>
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 relative">
            <div className="absolute inset-0 bg-white rounded-full" />
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-full" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full" />
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <CardTitle className="text-2xl mb-1">Service Provider</CardTitle>
              <div className="space-y-1">
                <div>
                  <span className="text-muted-foreground capitalize">{professional.user.name}</span>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-400">{professional.businessName}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Provider Location</span>
                  <p className="text-lg font-semibold text-blue-900 dark:text-blue-400">{professional.locationAddress}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-red-500 text-red-500" />
              <span className="text-2xl">{professional.rating}</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 py-4 border-t border-muted-foreground">
            {appointmentsTotalLoading ? (
              <p>Loading...</p>
            ) : appointmentsTotalError ? (
              <p>Error loading data</p>
            ) : (
              appointmentsTotal?.data.map((item) => (
                <InfoField
                  key={item.status}
                  label={`${
                    item.status.charAt(0).toUpperCase() +
                                     item.status.slice(1)
                  } Orders`}
                  value={`${
                    item.totalAppointments
                  } (Total: ${new Intl.NumberFormat("en-US").format(
                    item.totalAmount
                  )} KES)`}
                />
              ))
            )}
            {/* Total Revenue (Completed Orders) */}
            <div>
              <p className="text-sm text-gray-500">
                                 Total Revenue (Completed)
              </p>
              <div className="flex items-center gap-2">
                <FaMoneyBill className="text-green-500" />
                <p className="font-medium truncate">
                  {appointmentsTotalLoading
                    ? "Loading..."
                    : appointmentsTotalError
                      ? "Error"
                      : `KES ${new Intl.NumberFormat("en-US").format(
                        appointmentsTotal?.data
                          .filter((item) => item.status === "completed")
                          .reduce(
                            (sum, item) => sum + item.totalAmount,
                            0
                          ) || 0
                      )}`}
                </p>
              </div>
            </div>
            {/* Total Expected (Pending & Scheduled) */}
            <div>
              <p className="text-sm text-gray-500">
                                 Total Expected (Pending & Scheduled)
              </p>
              <div className="flex items-center gap-2">
                <FaMoneyBill className="text-yellow-500" />
                <p className="font-medium truncate">
                  {appointmentsTotalLoading
                    ? "Loading..."
                    : appointmentsTotalError
                      ? "Error"
                      : `KES ${new Intl.NumberFormat("en-US").format(
                        appointmentsTotal?.data
                          .filter(
                            (item) =>
                              item.status === "pending" ||
                                               item.status === "scheduled"
                          )
                          .reduce(
                            (sum, item) => sum + item.totalAmount,
                            0
                          ) || 0
                      )}`}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Provider Phone</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-gray-300">{professional.user.phoneNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Provider Email;</p>
              <p className="text-lg font-semibold text-blue-900 dark:text-gray-300">{professional.user.email}</p>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );

};

export default BusinessCard;