export interface Coordinates {
  x: number;
  y: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  profilePicturePath: string;
  bio: string | null;
  locationAddress: string | null;
  isActive: boolean;
  deactivatedAt: string | null;
  deactivatedBy: string | null;
  deactivatedReason: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  createdAt: string;
  updatedAt: string;
  latitude: number | null;
  longitude: number | null;
  coordinates: Coordinates;
  fcmToken: string;
};


export interface Client {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl: string;
  profilePicturePath: string;
  bio: string | null;
  locationAddress: string;
  isActive: boolean;
  deactivatedAt: string | null;
  deactivatedBy: string | null;
  deactivatedReason: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  createdAt: string;
  updatedAt: string;
  latitude: string;
  longitude: string;
  coordinates: Coordinates;
  fcmToken: string;
}

export interface Professional {
  id: string;
  locationAddress: string;
  resumeUrl: string | null;
  resumePath: string | null;
  isVerified: boolean;
  isActive: boolean;
  user?: User;
  termsAndConditions: boolean;
  deactivatedAt: string | null;
  deactivatedBy: string | null;
  deactivatedReason: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  createdAt: string;
  updatedAt: string;
  coordinates: Coordinates;
  latitude: string;
  longitude: string;
  businessName: string;
  registrationProgress: number;
  businessType: string;
  specialization: string | null;
  bio: string;
  fcmToken: string | null;
  topRated: boolean;
  rating: number;
}

export interface Service {
  id: string;
  price: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  professionalId: string;
  serviceId: string;
  brands: string[];
  duration: number;
  description: string | null;
  imagePath: string | null;
  imageUrl: string | null;
  name: string | null;
  category: string;
}

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
  client: Client;
  professional: Professional;
  service: Service;
}

export interface ApiResponse {
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
