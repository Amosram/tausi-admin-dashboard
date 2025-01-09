import React, { ReactNode, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { format } from "date-fns";
import Loader from "@/components/layout/Loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  User,
  DollarSign,
  Info,
} from "lucide-react";
import { FaMoneyBill, FaStar, FaUser } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { IoChatboxEllipsesSharp } from "react-icons/io5";
import { useToast } from "@/hooks/use-toast";
import { useGetOrderByIdQuery } from "../api/ordersApi";
import { BiCategory } from "react-icons/bi";

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  titleLink?: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  title,
  icon,
  children,
  titleLink,
}) => (
  <Card className="flex-1">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon}
        {titleLink ? (
          <Link to={titleLink} className="hover:underline hover:text-primary">
            {title}
          </Link>
        ) : (
          title
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

interface StatusBadgeProps {
  status: string;
  variant?: "default" | "payment";
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = "default",
}) => {
  const getStatusColor = (status: string, variant: string) => {
    if (variant === "payment") {
      return status === "Paid"
        ? "bg-transparent border border-green-500 text-green-500"
        : "bg-transparent border border-blue-500 text-blue-500";
    }

    const statusColors = {
      completed: "bg-transparent border-2 border-green-500 text-green-500",
      pending: "bg-transparent border-2 border-blue-500 text-blue-500",
      cancelled: "bg-transparent border-2 border-red-500 text-red-500",
    };

    const lowercaseStatus = status.toLowerCase();
    return (
      statusColors[lowercaseStatus] ||
      "bg-transparent border-2 border-gray-500 text-gray-500"
    );
  };

  return (
    <Badge className={`${getStatusColor(status, variant)} text-sm px-3 py-1`}>
      {status}
    </Badge>
  );
};

interface ContactInfoProps {
  icon: ReactNode;
  value: string;
}

const ContactInfo: React.FC<ContactInfoProps> = ({ icon, value }) => (
  <div className="flex items-center gap-2">
    {icon}
    <p className="font-medium truncate">{value}</p>
  </div>
);

interface InfoFieldProps {
  label: string;
  value: string | ReactNode;
}

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

const OrderDetails: React.FC = () => {
  const { toast } = useToast();
  const { orderId } = useParams();

  const { data, isLoading, error } = useGetOrderByIdQuery(orderId!);

  useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Failed to load orders. Please try again later.",
      });
    }
  }, [error, toast]);

  const currentOrder = data?.data;

  if (isLoading) return <Loader />;
  if (error) return <div>Error: Unable to load orders.</div>;
  if (!currentOrder) return <div className="p-4">No order found</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex lg:flex-row flex-col gap-4">
          <div className="flex flex-col gap-3 lg:w-1/2 items-stretch">
            {/* Order Information Card */}
            <InfoCard
              title="Order Information"
              icon={<Calendar className="h-5 w-5" />}
            >
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoField
                    label="Category"
                    value={currentOrder.service.category.name}
                  />
                  <InfoField
                    label="Order Status"
                    value={<StatusBadge status={currentOrder.status} />}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoField
                    label="Location"
                    value={
                      <ContactInfo
                        icon={<MapPin className="h-4 w-4 mt-1 text-gray-400" />}
                        value={currentOrder.locationAddress}
                      />
                    }
                  />
                  <InfoField label="Order ID" value={currentOrder.id} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <InfoField
                    label="Date"
                    value={format(
                      new Date(currentOrder.appointmentDate),
                      "PPP"
                    )}
                  />
                  <InfoField
                    label="Time"
                    value={`${currentOrder.appointmentStartTime} - ${currentOrder.appointmentEndTime}`}
                  />
                </div>
              </div>
            </InfoCard>

            {/* Client Information Card */}
            <InfoCard
              title="Client Information"
              icon={<User className="h-5 w-5" />}
              titleLink="/orders"
            >
              <div className="flex gap-4">
                <div
                  className={`md:w-16 md:h-14 w-12 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-4`}
                >
                  <div className="md:w-8 md:h-8 w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="flex flex-col w-full">
                  <div className="grid grid-cols-2 gap-6 border-b border-gray-300 pt-2 pb-4">
                    <InfoField
                      label="Client Name"
                      value={currentOrder.client.name}
                    />
                    {currentOrder.bookingForGroup && (
                      <InfoField
                        label="Group Size"
                        value={`${currentOrder.numberOfClients} people`}
                      />
                    )}
                    <InfoField
                      label="Client Location"
                      value={currentOrder.client.locationAddress}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6 border-b border-gray-300 py-4">
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Client Phone</p>
                      <ContactInfo
                        icon={<Phone className="h-4 w-4 text-gray-400" />}
                        value={currentOrder.client.phoneNumber}
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Client Email</p>
                      {currentOrder.client.email && (
                        <ContactInfo
                          icon={<Mail className="h-4 w-4 text-gray-400" />}
                          value={currentOrder.client.email}
                        />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-4 pb-2">
                    <InfoField label="Orders Made" value="____" />
                    <InfoField label="Total Expenses" value="KES ____" />
                    <div className="flex justify-center items-center">
                      <Button
                        size="icon"
                        className="p-4 rounded-full bg-primary"
                        asChild
                      >
                        <Link to={`/users/${currentOrder.client.id}`}>
                          <FaUser className="text-white" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>
          </div>

          <div className="flex flex-col gap-3 lg:w-1/2 items-stretch">
            {/* Service Provider Card */}
            <InfoCard
              title="Service Provider"
              icon={<User className="h-5 w-5" />}
              titleLink="/orders"
            >
              <div className="flex gap-3">
                <div
                  className={`md:w-16 md:h-14 w-12 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-4`}
                >
                  <img
                    src={currentOrder.professional?.user?.profilePictureUrl}
                    alt={currentOrder.professional?.user?.name}
                  />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 py-4">
                    <InfoField
                      label="Business Name"
                      value={currentOrder.professional.businessName}
                    />
                    <InfoField
                      label="Provider Location"
                      value={currentOrder.professional.locationAddress}
                    />
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center gap-2">
                        <FaStar className="text-primary" />
                        <p className="font-medium truncate">
                          {currentOrder.professional.rating}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-muted-foreground">
                    <InfoField label="Completed Orders" value="_____" />
                    <InfoField label="Cancelled Orders" value="_____" />
                    <div>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                      <div className="flex items-center gap-2">
                        <FaMoneyBill className="text-green-500" />
                        <p className="font-medium truncate">KES ____</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 py-4 border-t border-muted-foreground">
                    <InfoField label="Provider Phone" value={currentOrder.professional?.user?.phoneNumber} />
                    <InfoField
                      label="Provider Email"
                      value={currentOrder.professional?.user?.email}
                    />
                    <div className="flex justify-center items-center">
                      <Button
                        size="icon"
                        className="p-4 rounded-full bg-blue-500"
                        asChild
                      >
                        <Link
                          to={`/professionals/${currentOrder.professionalId}`}
                        >
                          <FaUser className="text-white" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </InfoCard>

            {/* Payment Information Card */}
            <InfoCard
              title="Payment Information"
              icon={<DollarSign className="h-5 w-5" />}
            >
              <div className="flex lg:flex-row flex-col lg:items-center gap-6">
                <div className="flex gap-6">
                  <InfoField
                    label="Total Amount"
                    value={`KES ${currentOrder.totalPrice}`}
                  />
                  <InfoField
                    label="Payment Status"
                    value={
                      <StatusBadge
                        status={currentOrder.isPaid ? "Paid" : "Pending"}
                        variant="payment"
                      />
                    }
                  />
                </div>
                {currentOrder.amountUpfront > 0 && (
                  <div className="flex gap-6 items-center">
                    <InfoField
                      label="Booking Amount"
                      value={`KES ${currentOrder.amountUpfront}`}
                    />
                    <InfoField
                      label="Balance"
                      value={`KES ${
                        currentOrder.totalPrice - currentOrder.amountUpfront
                      }`}
                    />
                  </div>
                )}
              </div>
            </InfoCard>
          </div>
        </div>

        <div className="w-full">
          <InfoCard
            title="Service Category"
            icon={<BiCategory className="h-5 w-5" />}
            titleLink="/services"
          >
            <div className="flex gap-4">
              <div
                className={`md:w-16 md:h-14 w-12 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-4`}
              >
                <div className="md:w-8 md:h-8 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div className="flex flex-col w-full">
                <div className="grid grid-cols-3 gap-6 border-b border-gray-300 pt-2 pb-4">
                  <InfoField
                    label="Category Name"
                    value={currentOrder.service.category.name}
                  />
                  <InfoField
                    label="Category Description"
                    value={currentOrder.service.category.description}
                  />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Minimum Price</p>
                    <p className="text-sm text-gray-700">{`KES ${currentOrder.service.serviceData.minimumPrice}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Additional Information Card */}
        {(currentOrder.additionalInfo || currentOrder.appointmentDetails) && (
          <InfoCard
            title="Additional Information"
            icon={<Info className="h-5 w-5" />}
          >
            <div className="grid md:grid-cols-2 gap-6">
              {currentOrder.additionalInfo && (
                <InfoField label="Notes" value={currentOrder.additionalInfo} />
              )}
              {currentOrder.appointmentDetails && (
                <InfoField
                  label="Appointment Details"
                  value={currentOrder.appointmentDetails}
                />
              )}
            </div>
          </InfoCard>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
