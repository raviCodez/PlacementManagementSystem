import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-applications',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './admin-applications.component.html',
  styleUrls: ['./admin-applications.component.scss']
})
export class AdminApplicationsComponent implements OnInit {

  applications: any[] = [];
  isLoading = true;
  updatingId: number | null = null;

  statusOptions = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

  displayedColumns = [
    'student', 'company', 'department',
    'appliedAt', 'status', 'actions'
  ];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.adminService.getAllApplications().subscribe({
      next: (res) => {
        this.applications = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  updateStatus(app: any, newStatus: string): void {
    this.updatingId = app.id;
    this.adminService.updateApplicationStatus(app.id, newStatus).subscribe({
      next: (res) => {
        this.updatingId = null;
        app.status = newStatus;
        this.snackBar.open(
          `Status updated to ${newStatus}`, 'Close', { duration: 3000 }
        );
      },
      error: (err) => {
        this.updatingId = null;
        this.snackBar.open(
          err.error?.message || 'Update failed', 'Close', { duration: 3000 }
        );
      }
    });
  }

  getStatusClass(status: string): string {
    const map: any = {
      'APPLIED':     'applied',
      'SHORTLISTED': 'shortlisted',
      'SELECTED':    'selected',
      'REJECTED':    'rejected'
    };
    return map[status] || '';
  }
}