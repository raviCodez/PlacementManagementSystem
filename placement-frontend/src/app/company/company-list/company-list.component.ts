import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { CompanyService } from '../company.service';
import { CompanyResponse } from '../../core/models/company.model';
import { AuthStorageService } from '../../core/services/auth-storage.service';

@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

  companies: CompanyResponse[] = [];
  filteredCompanies: CompanyResponse[] = [];
  isLoading = true;
  searchText = '';
  selectedStatus = 'ALL';
  applyingId: number | null = null;

  statusOptions = ['ALL', 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

  constructor(
    private companyService: CompanyService,
    private authStorage: AuthStorageService,
    private snackBar: MatSnackBar
  ) {}

  get isStudent(): boolean {
    return this.authStorage.getRole() === 'STUDENT';
  }

  get isAdminOrPlacement(): boolean {
    const role = this.authStorage.getRole();
    return role === 'ADMIN' || role === 'PLACEMENT_TEAM';
  }

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.isLoading = true;

    // Students see only eligible companies
    const request$ = this.isStudent
      ? this.companyService.getEligibleCompanies()
      : this.companyService.getAllCompanies();

    request$.subscribe({
      next: (res) => {
        this.companies = res.data;
        this.filteredCompanies = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilter(): void {
    this.filteredCompanies = this.companies.filter(c => {
      const matchSearch = c.name.toLowerCase()
        .includes(this.searchText.toLowerCase()) ||
        c.jobRole.toLowerCase()
        .includes(this.searchText.toLowerCase());

      const matchStatus = this.selectedStatus === 'ALL'
        || c.status === this.selectedStatus;

      return matchSearch && matchStatus;
    });
  }

  applyToCompany(company: CompanyResponse): void {
    this.applyingId = company.id;
    this.companyService.applyToCompany(company.id).subscribe({
      next: () => {
        this.applyingId = null;
        this.snackBar.open(
          `Applied to ${company.name} successfully! 🎉`,
          'Close', { duration: 3000 }
        );
      },
      error: (err) => {
        this.applyingId = null;
        this.snackBar.open(
          err.error?.message || 'Application failed.',
          'Close', { duration: 4000 }
        );
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'UPCOMING':  'status-upcoming',
      'ACTIVE':    'status-active',
      'COMPLETED': 'status-completed',
      'CANCELLED': 'status-cancelled'
    };
    return map[status] || '';
  }
}