import { Timestamp } from "firebase/firestore";

export interface Page {
    cursor?: string;
    limit?: number;
}

export interface Response<T> {
    statusCode: string;
    message: string;
    data: T;
}

export interface GlobalSettings {
    onBoardingComplete?: boolean;
    language?: string;
    drawerOpen?: boolean;
}

export enum UserType {
    CLIENT = 'client',
    PROFESSIONAL = 'professional'
}

export interface Attachment {
    url: string;
    name: string;
    type: string;
    size: number;
}

export interface ChatItemProps {
    id: string;
    text: string;
    sender: string;
    recipient: string | string[];
    read: boolean;
    timestamp: string; // Changed from createdAt to timestamp for consistency
    createdAt: Date | Timestamp;
    senderName: string;
    senderAvatar: string;
    messageType: 'text' | 'image' | 'video' | 'audio';
    attachments: Attachment[];
    replyTo?: string | null;
    reactions?: Record<string, string>;
    edited?: boolean;
    delivered?: boolean;
}

export interface ChatUser {
    id: string;
    name: string;
    profilePicture: string;
    email?: string; // Optional property for user's email
    phoneNumber?: string; // Optional property for user's phone number
    lastActive?: Date;
}

export interface ChatDocument {
    id: string;
    beautician: ChatUser | null;
    client: ChatUser | null;
    completed: boolean;
    messages: ChatItemProps[];
}