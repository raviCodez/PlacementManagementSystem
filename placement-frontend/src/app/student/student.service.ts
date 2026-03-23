import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api-response.model';
import { StudentSummaryResponse, StudentProfileUpdateRequest } from '../core/models/student.model';
import { ApplicationResponse } from '../core/models/application.model';

@Injectable({ providedIn: 'root' })
export class StudentService {

  private apiUrl = `${environment.apiUrl}/student`;

  constructor(private http: HttpClient) {}

  // Get logged-in student's profile
  getProfile(): Observable<ApiResponse<StudentSummaryResponse>> {
    return this.http.get<ApiResponse<StudentSummaryResponse>>(
      `${this.apiUrl}/profile`
    );
  }

  // Update profile (CGPA, skills, etc.)
  updateProfile(data: StudentProfileUpdateRequest): Observable<ApiResponse<StudentSummaryResponse>> {
    return this.http.put<ApiResponse<StudentSummaryResponse>>(
      `${this.apiUrl}/profile`, data
    );
  }

  // Get all applications of this student
  getMyApplications(): Observable<ApiResponse<ApplicationResponse[]>> {
    return this.http.get<ApiResponse<ApplicationResponse[]>>(
      `${this.apiUrl}/applications`
    );
  }

  // Apply to a company
  applyToCompany(companyId: number): Observable<ApiResponse<ApplicationResponse>> {
    return this.http.post<ApiResponse<ApplicationResponse>>(
      `${this.apiUrl}/apply/${companyId}`, {}
    );
  }

  // Upload resume (PDF)
  uploadResume(file: File): Observable<ApiResponse<string>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/resume`, formData
    );
  }

  // Get student dashboard data
  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrl}/dashboard/student`
    );
  }

  // Get eligible companies for this student
  getEligibleCompanies(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${environment.apiUrl}/companies/eligible`
    );
  }

  // Get feedback received
  getMyFeedback(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/feedback`
    );
  }
}