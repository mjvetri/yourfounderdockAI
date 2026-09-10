export enum UserRole {
  FOUNDER = 'FOUNDER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'validating' | 'building' | 'launched';
  progress: number;
  category: 'software' | 'hardware';
  createdAt: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface RoadmapItem {
  id: string;
  phase: string;
  tasks: { id: string; title: string; completed: boolean }[];
}