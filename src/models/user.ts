export interface Service {
  id:               string;
  name:             string;
  minimumPrice?:    number;
  category?:        string;
  description:      string;
  imageUrl:         string;
  imagePath:        string;
  isDeleted:        boolean;
  deletedAt:        null;
  createdAt:        Date;
  updatedAt:        Date;
  serviceCategory?: Service;
}

export interface ServiceCategory {
  id:          string;
  name:        string;
  description: string;
  imageUrl:    string;
  imagePath:   string;
  isDeleted:   boolean;
  deletedAt:   null;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface TausiUser {
  bio?:                string | null;
  createdAt:          Date;
  deactivatedAt:      null;
  deactivatedBy:      null;
  deactivatedReason:  null;
  deletedAt:          null;
  deletedReason:      null;
  email:              string;
  emailVerified:      boolean;
  fcmToken:           string | null;
  id:                 string;
  isActive:           boolean;
  isDeleted:          boolean;
  latitude:           string;
  locationAddress:    string;
  longitude:          string;
  name:               string;
  phoneNumber:        string;
  phoneVerified:      boolean;
  profilePicturePath: string | null;
  profilePictureUrl:  string | null;
  updatedAt:          Date;
  sessionData:        SessionData;
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
