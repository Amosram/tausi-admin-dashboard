export interface Coordinates {
  x: number;
  y: number;
}

// export interface Service {
//   id:               string;
//   name:             string;
//   minimumPrice?:    number;
//   category?:        string;
//   description:      string;
//   imageUrl:         string;
//   imagePath:        string;
//   isDeleted:        boolean;
//   deletedAt:        null;
//   createdAt:        Date;
//   updatedAt:        Date;
//   serviceCategory?: Service;
// }

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

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  imagePath: string;
  isDeleted: boolean;
  deletedAt: null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TausiUser {
  bio?: string | null;
  createdAt: Date;
  role: string;
  deactivatedAt: null;
  deactivatedBy: null;
  deactivatedReason: null;
  deletedAt: null;
  deletedReason: null;
  email: string;
  emailVerified: boolean;
  fcmToken: string | null;
  id: string;
  isActive: boolean;
  isDeleted: boolean;
  latitude: string;
  locationAddress: string;
  longitude: string;
  name: string;
  phoneNumber: string;
  phoneVerified: boolean;
  profilePicturePath: string | null;
  profilePictureUrl: string | null;
  updatedAt: Date;
  sessionData: SessionData;
}

export interface TausiProfessional {
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
}

export interface TausiClient {
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

export interface SessionData {
  id: number;
  userId: string;
  userTypeSession: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  isDeleted: boolean;
}
