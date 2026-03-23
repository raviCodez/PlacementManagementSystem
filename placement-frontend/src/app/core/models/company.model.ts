export interface CompanyResponse {
  id: number;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  packageOffered: number;
  minimumCgpa: number;
  maxBacklogs: number;
  driveDate: string;
  driveLocation: string;
  registrationDeadline: string;
  jobRole: string;
  jobDescription: string;
  status: string;
  allowedDepartments: string[];
  totalApplications: number;
  shortlistedCount: number;
  selectedCount: number;
  isEligible: boolean;
  createdByName: string;
  createdAt: string;
}

export interface CompanyRequest {
  name: string;
  description?: string;
  website?: string;
  packageOffered: number;
  minimumCgpa: number;
  maxBacklogs?: number;
  driveDate: string;
  driveLocation?: string;
  registrationDeadline?: string;
  jobRole: string;
  jobDescription?: string;
  status?: string;
  allowedDepartmentIds: number[];
}