import { Appointment, OrdersTableData } from "../types";

export const transformToTableData = (
  appointments: Appointment[]
): OrdersTableData[] => {
  return appointments.map((appointment) => ({
    orderId: appointment.id,
    orderDate: new Date(appointment.appointmentDate).toLocaleDateString(),
    serviceProvider: appointment.professional.businessName,
    category: appointment.service.category,
    location: appointment.locationAddress,
    contact: appointment.client.phoneNumber,
    status: appointment.status,
  }));
};
