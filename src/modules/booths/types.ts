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
  coordinates: string | null;
  boundaries: string | null;
  numberOfBeauticians: number;
  numberOfStations: number;
  imagePath: string | null;
  imageUrl: string | null;
  underMaintenance: boolean;
  occupancyStatus: "empty" | "partially_occupied" | "fully_occupied";
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
  beautician: {
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
    coordinates: string | null;
    latitude: string;
    longitude: string;
    businessName: string;
    parentId: string | null;
    registrationProgress: number;
    businessType: "individual" | "corporate";
    specialization: string | null;
    bio: string;
    fcmToken: string | null;
    topRated: boolean;
    rating: number;
  };
  logs: Array<{
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
    oldValues: Record<string, any> | null;
    newValues: Record<string, any> | null;
  }>;
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
