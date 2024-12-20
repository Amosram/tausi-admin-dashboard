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
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

const BoothOrdersPage = () => {
  const { boothId } = useParams();
  const { data, error, isLoading } = useGetOrderByBoothIdQuery(boothId);
  const [selectedOrder, setSelectedOrder] = useState<Appointment>(null);

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

  const ordersData: Appointment[] = data?.data;

  return (
    <>
      <div className="p-6">
        <Link
          to={`/booths/${boothId}`}
          className="w-full items-center flex flex-col p-4 hover:underline text-blue-500"
        >
          Go Back
        </Link>
        {ordersData.map((order) => (
          <div
            key={order.id}
            className="p-4 border border-gray-300 bg-white rounded-lg shadow-sm mb-4 transition-shadow duration-200 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold text-gray-800 mb-2">
                Order ID: {order.id}
              </p>
              <p className="text-gray-600">
                Amount: <span className="font-medium">${order.totalPrice}</span>
              </p>

              <p className="text-gray-600">
                Amount Upfront: ${order.amountUpfront}
              </p>
            </div>
            <div className="flex flex-col gap-2 items-end">
              <p className="flex items-center gap-2 mt-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-sm font-medium text-white ${
                    order.isPaid ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {order.isPaid ? "Paid" : "Not Paid"}
                </span>
              </p>
              <Button
                onClick={() => setSelectedOrder(order)}
                variant="link"
                className="inline-block mt-4 text-blue-600 hover:underline px-0"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
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
              <div className="text-gray-700">${selectedOrder.totalPrice}</div>

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
