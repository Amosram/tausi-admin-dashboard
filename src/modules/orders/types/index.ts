import {
  Coordinates,
  Service,
  TausiClient,
  TausiProfessional,
} from "@/models/user";

export interface Appointment {
  id: string;
  clientId: string;
  professionalId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentStartTime: string;
  appointmentEndTime: string;
  status: string;
  numberOfClients: number;
  bookingForGroup: boolean;
  totalPrice: number;
  amountUpfront: number;
  chatId: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  appointmentDetails: string | null;
  locationAddress: string;
  latitude: number;
  longitude: number;
  additionalInfo: string;
  coordinates: Coordinates;
  client: TausiClient;
  professional: TausiProfessional;
  service: Service;
}

export interface AppointmentsApiResponse {
  statusCode: string;
  message: string;
  code: number;
  data: Appointment;
}

export interface OrdersTableData {
  orderId: string;
  orderDate: string;
  serviceProvider: string;
  category: string;
  location: string;
  contact: string;
  status: string;
  startTime: string;
}
