import { SessionData, TausiUser, TausiUserDetails } from "./user";

export interface Coordinates {
  x: number;
  y: number;
}

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
  user?: TausiUser;
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
  services: Service[];
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
  serviceData: {
    id:           string;
    name:         string;
    minimumPrice: number;
    category:     string;
    description:  string;
    imageUrl:     string;
    imagePath:    string;
    isDeleted:    boolean;
    deletedAt:    null;
    createdAt:    Date;
    updatedAt:    Date;
  };
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

export interface ApiResponse<T> {
  //DO NOT DELETE OR CHANGE THIS INTERFACE
  statusCode: string;
  message: string;
  data: T;
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

export interface UsersApiResponse {
  users: TausiUser;
  userSessionData: SessionData;
}

export interface SingleUserApiResponse {
  statusCode: string;
  code: number;
  message: string;
  data: TausiUserDetails;
}

export interface CreateUserRequest {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  userTypeSession: "professional" | "client" | "user";
  bio: string;
  profilePictureUrl?: string;
  profilePicturePath?: string;
}

export interface AppointmentsApiResponse {
  statusCode: string;
  message: string;
  code: number;
  data: Appointment;
}

export interface ProfessionalApiResponse {
  statusCode: string;
  message: string;
  code: number;
  data: Professional;
}


export interface Portfolio {
  id:                    string;
  isDeleted:             boolean;
  deletedAt:             null;
  createdAt:             Date;
  updatedAt:             Date;
  imagePath:             string;
  imageUrl:              string;
  professionalId:        string;
  serviceId:             string;
  professionalServiceId: string;
  service:               Service;
  professionalService:   ProfessionalService;
}

export interface ProfessionalService {
  id:             string;
  price:          number;
  isDeleted:      boolean;
  deletedAt:      null;
  createdAt:      Date;
  updatedAt:      Date;
  professionalId: string;
  serviceId:      string;
  brands:         string[];
  duration:       number;
  description:    null;
  imagePath:      null;
  imageUrl:       null | string;
  name:           null;
}

export interface PortfolioApiResponse {
  statusCode: string;
  message:    string;
  data:       Portfolio[];
}

export interface VerifiedBeauticiansResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       VerifiedBeauticians;
}

export interface VerifiedBeauticians extends UpdateVerifiedBeautician {
  id:                   string;
  locationAddress:      string;
  resumeUrl:            null;
  resumePath:           null | string;
  isVerified:           boolean;
  isActive:             boolean;
  termsAndConditions:   boolean;
  deactivatedAt:        null;
  deactivatedBy:        null;
  deactivatedReason:    null;
  isDeleted:            boolean;
  deletedAt:            null;
  deletedReason:        null;
  createdAt:            Date;
  updatedAt:            Date;
  coordinates:          Coordinates | null;
  latitude:             string;
  longitude:            string;
  businessName:         string;
  parentId:             null;
  registrationProgress: number;
  businessType:         BusinessType;
  specialization:       null | string;
  bio:                  string;
  fcmToken:             null;
  topRated:             boolean;
  rating:               number;
  verificationData:     {
    id:                      string;
    verificationStatus:      VerificationStatus;
    verificationTitle:       VerificationTitle;
    verificationDescription: string;
    reviewedBy:              null | string;
    isDeleted:               boolean;
    deletedAt:               null;
    createdAt:               Date;
    updatedAt:               Date;
    verificationDocuments:   any[];
  };
  user:                 User;
  portfolio:            any[];
  services:             Service[];
}

export interface UpdateVerifiedBeautician {
    verificationStatus:      string;
    verificationDescription: string;
    reviewedBy:              string;
}

export enum BusinessType {
  Individual = "individual",
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface User {
  id:                 string;
  name:               string;
  email:              string;
  phoneNumber:        string;
  profilePictureUrl:  string;
  profilePicturePath: string;
  bio:                null;
  locationAddress:    null;
  isActive:           boolean;
  deactivatedAt:      null;
  deactivatedBy:      null;
  deactivatedReason:  null;
  phoneVerified:      boolean;
  emailVerified:      boolean;
  isDeleted:          boolean;
  deletedAt:          null;
  deletedReason:      null;
  createdAt:          Date;
  updatedAt:          Date;
  latitude:           null;
  longitude:          null;
  coordinates:        null;
  fcmToken:           string;
}

export enum VerificationStatus {
  Pending = "pending",
  Rejected = "rejected",
  Review = "review",
}

export enum VerificationTitle {
  WeReSorryYourApplicationHasBeenRejected = "We're sorry your application has been rejected",
  YouAreAwaitingApproval = "You are awaiting approval",
}


export interface Ledgers {
  id:          string;
  name:        string;
  createdAt:   Date;
  updatedAt:   Date;
  isDeleted:   boolean;
  deletedAt:   Date | null;
  description: null;
  ownerId:     string;
}
export interface LedgersApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       Ledgers[];
}

export interface BooksApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       Books[];
}

export interface Books {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: null;
  ledgerId:  string;
}


export interface CreateUpdateLoanBook {
    name: string;
    ledgerId: string
}