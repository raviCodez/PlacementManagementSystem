import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../core/models/api-response.model';
import { CompanyResponse, CompanyRequest } from '../core/models/company.model';

@Injectable({ providedIn: 'root' })
export class CompanyService {

  private apiUrl = `${environment.apiUrl}/companies`;

  constructor(private http: HttpClient) {}

  // Get all companies
  getAllCompanies(): Observable<ApiResponse<CompanyResponse[]>> {
    return this.http.get<ApiResponse<CompanyResponse[]>>(this.apiUrl);
  }

  // Get single company by ID
  getCompanyById(id: number): Observable<ApiResponse<CompanyResponse>> {
    return this.http.get<ApiResponse<CompanyResponse>>(`${this.apiUrl}/${id}`);
  }

  // Get companies by status
  getByStatus(status: string): Observable<ApiResponse<CompanyResponse[]>> {
    return this.http.get<ApiResponse<CompanyResponse[]>>(
      `${this.apiUrl}/status/${status}`
    );
  }

  // Get eligible companies for logged-in student
  getEligibleCompanies(): Observable<ApiResponse<CompanyResponse[]>> {
    return this.http.get<ApiResponse<CompanyResponse[]>>(
      `${this.apiUrl}/eligible`
    );
  }

  // Create company (Admin / Placement Team)
  createCompany(data: CompanyRequest): Observable<ApiResponse<CompanyResponse>> {
    return this.http.post<ApiResponse<CompanyResponse>>(this.apiUrl, data);
  }

  // Update company
  updateCompany(id: number, data: CompanyRequest): Observable<ApiResponse<CompanyResponse>> {
    return this.http.put<ApiResponse<CompanyResponse>>(
      `${this.apiUrl}/${id}`, data
    );
  }

  // Update only status
  updateStatus(id: number, status: string): Observable<ApiResponse<CompanyResponse>> {
    return this.http.patch<ApiResponse<CompanyResponse>>(
      `${this.apiUrl}/${id}/status?status=${status}`, {}
    );
  }

  // Delete company (Admin only)
  deleteCompany(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }

  // Apply to company (Student)
  applyToCompany(companyId: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${environment.apiUrl}/student/apply/${companyId}`, {}
    );
  }
}