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
  locationAddress?: string | null;
  resumeUrl?: string | null;
  resumePath?: string | null;
  isVerified: boolean;
  isActive: boolean;
  termsAndConditions: boolean;
  deactivatedAt?: string | null;
  deactivatedBy?: string | null;
  deactivatedReason?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  coordinates?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  businessName?: string | null;
  registrationProgress: number;
  businessType: string;
  specialization?: string | null;
  bio?: string | null;
  fcmToken?: string | null;
  topRated: boolean;
  rating: number;
  verificationData: VerificationData;
}

export interface TausiUserDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  profilePictureUrl?: string | null;
  profilePicturePath?: string | null;
  bio?: string | null;
  locationAddress?: string | null;
  isActive: boolean;
  deactivatedAt?: string | null;
  deactivatedBy?: string | null;
  deactivatedReason?: string | null;
  phoneVerified: boolean;
  emailVerified: boolean;
  isDeleted: boolean;
  deletedAt?: string | null;
  deletedReason?: string | null;
  createdAt: string;
  updatedAt: string;
  latitude?: string | null;
  longitude?: string | null;
  coordinates?: string | null;
  fcmToken?: string | null;
  sessionData: SessionData;
  professional: TausiProfessional;
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

export interface VerificationData {
  id: string;
  verificationStatus: string;
  verificationTitle: string;
  verificationDescription: string;
  reviewedBy?: string | null;
  isDeleted: boolean;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}
