import { Coordinates } from "@/models";

export interface BoothAssignmentResponseNew {
  statusCode: string;
  code: number;
  message: string;
  data: BoothAssignmentDetailsNew;
}

export interface BoothAssignmentDetailsNew {
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
  booth: BoothDetailsNew;
  beautician: BeauticianDetailsNew;
  logs: BoothAssignmentLogNew[];
}

export interface BoothDetailsNew {
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
  boundaries: any | null;
  numberOfBeauticians: number;
  numberOfStations: number;
  imagePath: string | null;
  imageUrl: string | null;
  underMaintenance: boolean;
  occupancyStatus: string;
}

export interface BeauticianDetailsNew {
  id: string;
  locationAddress: string;
  resumeUrl: string | null;
  resumePath: string | null;
  isVerified: boolean;
  isActive: boolean;
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
  parentId: string | null;
  registrationProgress: number;
  businessType: string;
  specialization: string;
  bio: string;
  fcmToken: string | null;
  topRated: boolean;
  rating: number;
}

export interface BoothAssignmentLogNew {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  isDeleted: boolean;
  deletedAt: string | null;
  deletedReason: string | null;
  boothAssignmentId: string;
  action: string;
  description: string;
  performedBy: string;
  oldValues: any | null;
  newValues: Partial<BoothAssignmentDetailsNew>;
}

export interface BoothAvailabilityResponseNew {
  statusCode: "SUCCESS" | "FAILURE";
  code: number;
  message: string;
  data: {
    boothCapacity: number;
    occupancyStatus: "empty" | "partially_occupied" | "fully_occupied";
    numberOfBeauticians: number;
    availableStations: number;
    details: BoothAssignmentDetailsNew[];
  };
}
