import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { AdminService } from '../admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTableModule
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  dashboard: any = null;
  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getDashboard().subscribe({
      next: (res) => {
        this.dashboard = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  // Convert department map to array for display
  get departmentEntries(): { key: string, value: number }[] {
    if (!this.dashboard?.departmentWisePlacement) return [];
    return Object.entries(this.dashboard.departmentWisePlacement)
      .map(([key, value]) => ({ key, value: value as number }));
  }

  // Convert company map to array
  get companyEntries(): { key: string, value: number }[] {
    if (!this.dashboard?.companyWiseSelection) return [];
    return Object.entries(this.dashboard.companyWiseSelection)
      .map(([key, value]) => ({ key, value: value as number }));
  }
}