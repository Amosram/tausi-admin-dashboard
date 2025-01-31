import Loader from "@/components/layout/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Appointment } from "@/models";
import { useGetOrderByBoothIdQuery } from "@/modules/orders/api/ordersApi";
import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BoothOrdersTable } from "../components/booths-orders-table";
import { HiArrowLeft } from "react-icons/hi";

const BoothOrdersPage = () => {
  const { boothId } = useParams();
  const { data, error, isLoading } = useGetOrderByBoothIdQuery(boothId);
  const [selectedOrder, setSelectedOrder] = useState<Appointment | null>(null);

  const handleRowClick = useCallback((order: Appointment) => {
    setSelectedOrder(order);
  }, []);

  if (error) {
    return (
      <Card className="flex-1">
        <CardContent>Error Loading Orders</CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardContent>
          <Loader />
        </CardContent>
      </Card>
    );
  }

  const ordersData: Appointment[] = data?.data || [];

  return (
    <>
      <div className="p-6">
        <Link
          to={`/booths/${boothId}`}
          className="flex items-center text-blue-500 hover:underline text-lg font-semibold"
        >
          <HiArrowLeft className="mr-2" />
          Go Back
        </Link>
        <div className="mt-6">
          <BoothOrdersTable orders={ordersData} onRowClick={handleRowClick} />
        </div>
      </div>

      {selectedOrder && (
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500 font-medium">Appointment ID</div>
              <div className="text-gray-700">{selectedOrder.id}</div>

              <div className="text-gray-500 font-medium">Appointment Date</div>
              <div className="text-gray-700">
                {new Date(selectedOrder.appointmentDate).toLocaleDateString()}
              </div>

              <div className="text-gray-500 font-medium">Status</div>
              <div className="text-gray-700">{selectedOrder.status}</div>

              <div className="text-gray-500 font-medium">Total Price</div>
              <div className="text-gray-700">
                KES {selectedOrder.totalPrice}
              </div>

              <div className="text-gray-500 font-medium">Paid</div>
              <div className="text-gray-700">
                {selectedOrder.isPaid ? "Yes" : "No"}
              </div>

              <div className="text-gray-500 font-medium">Created At</div>
              <div className="text-gray-700">
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </div>

              {selectedOrder.deletedAt && (
                <>
                  <div className="text-gray-500 font-medium">Deleted At</div>
                  <div className="text-gray-700">
                    {new Date(selectedOrder.deletedAt).toLocaleString()}
                  </div>
                </>
              )}

              <div className="text-gray-500 font-medium">Additional Info</div>
              <div className="text-gray-700">
                {selectedOrder.additionalInfo || "No additional information"}
              </div>
            </div>

            <Button className="mt-4">
              <Link to={`/orders/${selectedOrder.id}`}>View Order</Link>
            </Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BoothOrdersPage;
