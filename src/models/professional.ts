export interface Professional {
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
    latitude:             string;
    longitude:            string;
    businessName:         string;
    registrationProgress: number;
    bio:                  string;
    fcmToken:             null;
    top_rated:            boolean;
    user:                 User;
    services:             Service[];
    rating:               number;
    availability:         Availability;
}

export interface Availability {
}

export interface Service {
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
    name:           null | string;
    serviceData:    ServiceData;
}

export interface ServiceData {
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
    fcmToken:           string;
    sessionData:        SessionData;
}

export interface SessionData {
    id:              number;
    userId:          string;
    userTypeSession: UserTypeSession;
    createdAt:       Date;
    updatedAt:       Date;
    deletedAt:       null;
    isDeleted:       boolean;
}

export enum UserTypeSession {
    Professional = "professional",
}

export interface ProfessionalsTableData {
    professionalId: string;
    dateApplied: string;
    dateReviewed: string;
    serviceProvider: string;
    service?: Service;
    location: string;
    contact: string;
    status: string;
  }
  