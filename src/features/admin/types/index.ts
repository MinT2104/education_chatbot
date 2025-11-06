export interface School {
  id: string;
  name: string;
  address: string;
  country: string;
  totalStudents: number;
  totalTeachers: number;
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  schoolId: string;
  schoolName: string;
  standard: string; // grade/class
  subject: string;
  uploadedBy: string;
  uploadedAt: string;
  indexed: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'admin';
  schoolId?: string;
  schoolName?: string;
  standard?: string;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive';
}

export interface Statistics {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalSchools: number;
  totalDocuments: number;
  totalChats: number;
  activeToday: number;
  storageUsed: number; // in MB
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'uploading' | 'indexing' | 'completed' | 'error';
  error?: string;
}

