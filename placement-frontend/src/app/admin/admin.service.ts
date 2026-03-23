import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api-response.model';

@Injectable({ providedIn: 'root' })
export class AdminService {

  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Get admin dashboard data
  getDashboard(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${environment.apiUrl}/dashboard/admin`
    );
  }

  // Get all students with optional filters
  getStudents(departmentId?: number, section?: string, isPlaced?: boolean):
      Observable<ApiResponse<any[]>> {
    let params: any = {};
    if (departmentId) params.departmentId = departmentId;
    if (section)      params.section = section;
    if (isPlaced !== undefined) params.isPlaced = isPlaced;

    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/students`, { params }
    );
  }

  // Get single student
  getStudent(studentId: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/students/${studentId}`
    );
  }

  // Update placement status manually
  updatePlacementStatus(studentId: number, isPlaced: boolean,
      companyId?: number, packageOffered?: number): Observable<ApiResponse<any>> {
    let params: any = { isPlaced };
    if (companyId)       params.companyId = companyId;
    if (packageOffered)  params.packageOffered = packageOffered;

    return this.http.patch<ApiResponse<any>>(
      `${this.apiUrl}/students/${studentId}/placement`, {}, { params }
    );
  }

  // Get all applications
  getAllApplications(companyId?: number, status?: string):
      Observable<ApiResponse<any[]>> {
    let params: any = {};
    if (companyId) params.companyId = companyId;
    if (status)    params.status = status;

    return this.http.get<ApiResponse<any[]>>(
      `${this.apiUrl}/applications`, { params }
    );
  }

  // Update application status
  updateApplicationStatus(id: number, status: string, remarks?: string):
      Observable<ApiResponse<any>> {
    let params: any = { status };
    if (remarks) params.remarks = remarks;

    return this.http.put<ApiResponse<any>>(
      `${this.apiUrl}/applications/${id}/status`, {}, { params }
    );
  }

  // Get analytics
  getAnalytics(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/analytics`
    );
  }

  // Get year-wise trends
  getTrends(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(
      `${this.apiUrl}/analytics/trends`
    );
  }
}