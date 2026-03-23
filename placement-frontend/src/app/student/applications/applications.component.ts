import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatBadgeModule } from '@angular/material/badge';
import { StudentService } from '../student.service';
import { ApplicationResponse } from '../../core/models/application.model';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatBadgeModule
  ],
  templateUrl: './applications.component.html',
  styleUrls: ['./applications.component.scss']
})
export class ApplicationsComponent implements OnInit {

  applications: ApplicationResponse[] = [];
  isLoading = true;
  displayedColumns = ['company', 'role', 'status', 'appliedAt'];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getMyApplications().subscribe({
      next: (res) => {
        this.applications = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  getStatusColor(status: string): string {
    const map: any = {
      'APPLIED':     'default',
      'SHORTLISTED': 'primary',
      'SELECTED':    'accent',
      'REJECTED':    'warn'
    };
    return map[status] || 'default';
  }

  getStatusIcon(status: string): string {
    const map: any = {
      'APPLIED':     'send',
      'SHORTLISTED': 'checklist',
      'SELECTED':    'celebration',
      'REJECTED':    'cancel'
    };
    return map[status] || 'info';
  }

  countByStatus(status: string): number {
  return this.applications.filter(a => a.status === status).length;
}
}