import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CompanyService } from '../company.service';
import { CompanyResponse } from '../../core/models/company.model';
import { AuthStorageService } from '../../core/services/auth-storage.service';

@Component({
  selector: 'app-company-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  company: CompanyResponse | null = null;
  isLoading = true;
  isApplying = false;

  constructor(
    private route: ActivatedRoute,
    private companyService: CompanyService,
    public authStorage: AuthStorageService,
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
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.companyService.getCompanyById(id).subscribe({
      next: (res) => {
        this.company = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyNow(): void {
    if (!this.company) return;
    this.isApplying = true;

    this.companyService.applyToCompany(this.company.id).subscribe({
      next: () => {
        this.isApplying = false;
        this.snackBar.open(
          'Application submitted successfully! 🎉',
          'Close', { duration: 3000 }
        );
      },
      error: (err) => {
        this.isApplying = false;
        this.snackBar.open(
          err.error?.message || 'Application failed.',
          'Close', { duration: 4000 }
        );
      }
    });
  }
}