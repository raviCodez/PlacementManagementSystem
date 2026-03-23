export interface StudentSummaryResponse {
  userId: number;
  name: string;
  email: string;
  rollNumber: string;
  section: string;
  departmentName: string;
  cgpa: number;
  backlogCount: number;
  skills: string;
  isPlaced: boolean;
  placedCompanyName: string;
  packageOffered: number;
  resumeUrl: string;
}

export interface StudentProfileUpdateRequest {
  cgpa?: number;
  marks10th?: number;
  marks12th?: number;
  backlogCount?: number;
  skills?: string[];
  section?: string;
  graduationYear?: number;
}