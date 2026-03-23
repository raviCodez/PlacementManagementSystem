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
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './student-detail.component.html',
  styleUrls: ['./student-detail.component.scss']
})
export class StudentDetailComponent implements OnInit {

  student: any = null;
  applications: any[] = [];
  isLoading = true;
  studentId!: number;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.studentId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadStudent();
    this.loadApplications();
  }

  loadStudent(): void {
    this.adminService.getStudent(this.studentId).subscribe({
      next: (res) => {
        this.student = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  loadApplications(): void {
    this.adminService.getAllApplications().subscribe({
      next: (res) => {
        // Filter only this student's applications
        this.applications = res.data.filter(
          (a: any) => a.studentId === this.studentId
        );
      }
    });
  }

  getSkills(): string[] {
    if (!this.student?.skills) return [];
    return this.student.skills.split(',').map((s: string) => s.trim());
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

  updateAppStatus(app: any, newStatus: string): void {
    this.adminService.updateApplicationStatus(app.id, newStatus).subscribe({
      next: () => {
        app.status = newStatus;
        this.snackBar.open(
          `Status updated to ${newStatus}`, 'Close', { duration: 3000 }
        );
      },
      error: (err) => {
        this.snackBar.open(
          err.error?.message || 'Update failed',
          'Close', { duration: 3000 }
        );
      }
    });
  }
}