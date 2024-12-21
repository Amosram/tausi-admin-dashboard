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
  bookAccess: any[];
  assignments: Assignment[];
  
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
  brands: string[] | null;
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

export interface OrdersSearchApiResponse {
  statusCode: string;
  code: number;
  message: string;
  data: Appointment[] | [];
}

export interface ProfSearchApiResponse {
  statusCode: string;
  code: number;
  message: string;
  data: Professional[] | [];
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
    isActive:               boolean;
    verificationStatus:      string;
    verificationTitle:      string;
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
  owner:       Owner;
  books:       Books[];
}

export interface LedgerDetails {
    id:           string;
    name:         string;
    createdAt:    Date;
    updatedAt:    Date;
    isDeleted:    boolean;
    deletedAt:    null;
    description?: null;
    ownerId:      string;
    books?:       Books[];
    ledgerId?:    string;
    bookEntries?: BookEntries[];
}

export interface LedgerDetailsApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       LedgerDetails;
}

export interface Owner {
  businessName: null | string;
}
export interface LedgersApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       Ledgers;
}

export interface BooksApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       Books;
}

export interface Books extends BookDetails {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: null;
  ledgerId:  string;
  ownerId:  string;
}

export interface BookDetails {
  id:              string;
  name:            string;
  createdAt:       Date;
  updatedAt:       Date;
  isDeleted:       boolean;
  deletedAt:       null;
  ownerId:         string;
  ledgerId:        string;
  bookEntries:     BookEntries[];
  entryCategories: BookCategories[];
  paymentModes:    PaymentModes[];
}

export interface BookEntriesApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       BookEntries[];
}
export interface BookCategoriesApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       BookCategories[];
}

export interface PaymentModesApiResponse {
  statusCode: string;
  code:       number;
  message:    string;
  data:       PaymentModes[];
}

export interface BookEntries {
  id:            string;
  title:         string;
  remark:        null;
  amount:        string;
  type:          "Expense" | "Revenue";
  createdAt:     Date;
  updatedAt:     Date;
  isDeleted:     boolean;
  deletedAt:     null;
  metadata:      null;
  categoryId:    string;
  paymentModeId: string;
  bookId:        string;
  ownerId:       string;
}

export interface BookCategories {
  id:        string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: null;
  bookId:    string;
  ledgerId:  string;
}

export interface PaymentModes {
  id:        string;
  mode:      string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
  deletedAt: null;
  bookId:    string;
  ledgerId:  string;
}

export interface CreateUpdateLoanBook {
    name: string;
    ledgerId: string;
    ownerId: string;
}

export interface CreateUpdateBookEntry {
  title:         string;
  type:          string;
  amount:        number;
  categoryId:    string;
  paymentModeId: string;
  bookId:        string;
  ownerId:       string;
}

export interface BoothsApiResponse<T> {
  statusCode: string;
  code: number;
  message: string;
  data: T;
};


export interface Assignment {
  id:                string;
  createdAt:         Date | string;
  updatedAt:         Date | string;
  isActive:          boolean;
  isDeleted:         boolean;
  deletedAt:         string | null;
  deletedReason:     string | null;
  boothId:           string;
  beauticianId:      string;
  startDate:         Date | string;
  endDate:           Date | string;
  isLapsed:          boolean;
  lapsedAt:          string | null;
  isTerminated:      boolean;
  terminatedBy:      string | null;
  terminatedAt:      string | null;
  terminationReason: string | null;
  booth:             Booth;
}


export interface Booth {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  name: string;
  locationAddress: string;
  coordinates: Coordinates;
  boundaries: unknown | null;
  numberOfBeauticians: number;
  numberOfStations: number;
  imagePath: string | null;
  imageUrl: string | null;
  underMaintenance: boolean;
  occupancyStatus: "empty" | "occupied" | string;
  assignments: BoothAssignmentDetails[] | [];
  logs: BoothLog[] | [];
};

export interface CreateBoothPayload {
  name: string;
  locationAddress: string;
  numberOfBeauticians?: number;
  numberOfStations?: number;
  occupancyStatus: "empty" | "occupied";
  imagePath?: string;
  imageUrl?: string;
  coordinates: {
    x: number;
    y: number;
  };
  boundaries?: unknown | null;
  underMaintenance?: boolean;
};

export interface BoothAssignmentResponse {
  statusCode: string;
  code: number;
  message: string;
  data: BoothAssignmentDetails[];
}

export interface BoothAssignmentDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  boothId: string;
  beauticianId: string;
  startDate: string;
  endDate: string;
  isLapsed: boolean;
  lapsedAt: string | null;
  isTerminated: boolean;
  terminatedBy: string | null;
  terminatedAt: string | null;
  terminationReason: string | null;
}

export interface BoothLog {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  boothId: string;
  action: string;
  description: string;
  performedBy: string;
  oldValues: Booth;
  newValues: Booth;
};

export interface CreateBoothAssignmentRequest {
  boothId: string;
  beauticianId: string;
  startDate: string;
  endDate: string;
}

export interface DashboardAnalyticsResponse {
    statusCode: string;
    code:       number;
    message:    string;
    data:       DashboardAnalyticsResponseData;
}

export interface DashboardAnalyticsResponseData {
    data: DashboardAnalyticsData;
}

export interface DashboardAnalyticsData {
    metrics: Metrics;
    revenue: Revenue;
    orders:  Orders;
}

export interface Metrics {
    totalCLients:           number;
    totalProfessionals:     number;
    totalRevenue:           number;
    allOrders:              number;
    total_orders:           number;
    completed_orders:       number;
    pending_orders:         number;
    sheduled_orders:        number;
    cancelled_orders:       number;
    total_users:            number;
    active_users:           number;
    inactive_users:         number;
    verified_users:         number;
    unverified_users:       number;
    total_professionals:    number;
    active_professionals:   number;
    verified_professionals: number;
}

export interface Orders {
    last_7_days:   Last[];
    last_1_month:  Last[];
    last_90_days:  Last[];
    last_6_months: Last[];
    last_year:     Last[];
}

export interface Last {
    appointment_date:   Date;
    status:             Status;
    total_appointments: number;
}

export enum Status {
    Cancelled = "cancelled",
    Pending = "pending",
}

export interface Revenue {
    last_7_days:   any[];
    last_1_month:  any[];
    last_90_days:  any[];
    last_6_months: any[];
    last_year:     LastYear[];
}

export interface LastYear {
    created_at: Date;
    revenue:    number;
}

export interface DashboardAnalyticsResponse {
    statusCode: string;
    code:       number;
    message:    string;
    data:       DashboardAnalyticsResponseData;
}

export interface DashboardAnalyticsResponseData {
    data: DashboardAnalyticsData;
}