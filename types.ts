export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isSubscribed: boolean;
  pendingSubscription?: boolean;
}

export enum MaterialType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  QUIZ = 'QUIZ'
}

export interface Material {
  id: string;
  title: string;
  type: MaterialType;
  isFree: boolean;
  url: string; // URL for video or PDF
  duration?: string; // For videos
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail: string;
  materials: Material[];
}