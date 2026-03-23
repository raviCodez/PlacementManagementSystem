import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { StudentService } from '../student.service';
import { AuthStorageService } from '../../core/services/auth-storage.service';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule,
    MatDividerModule,
    MatBadgeModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class StudentDashboardComponent implements OnInit {

  dashboard: any = null;
  isLoading = true;
  userName = '';

  constructor(
    private studentService: StudentService,
    private authStorage: AuthStorageService
  ) {}

  ngOnInit(): void {
    this.userName = this.authStorage.getUser()?.name || 'Student';
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.studentService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Convert status summary object to array for display
  get statusEntries(): { key: string, value: number }[] {
    if (!this.dashboard?.applicationStatusSummary) return [];
    return Object.entries(this.dashboard.applicationStatusSummary)
      .map(([key, value]) => ({ key, value: value as number }));
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'APPLIED': 'primary',
      'SHORTLISTED': 'accent',
      'SELECTED': 'warn',
      'REJECTED': ''
    };
    return colors[status] || 'primary';
  }
}