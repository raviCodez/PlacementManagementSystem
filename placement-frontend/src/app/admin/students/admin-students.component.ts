import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminService } from '../admin.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-students',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './admin-students.component.html',
  styleUrls: ['./admin-students.component.scss']  
})   
export class AdminStudentsComponent implements OnInit {


  students: any[] = [];
  filteredStudents: any[] = [];
  isLoading = true;
  searchText = '';
  filterPlaced = '';

  displayedColumns = [
    'name', 'email', 'department',
    'cgpa', 'backlogs', 'status', 'actions'
  ];

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents(): void {
    this.isLoading = true;
    const isPlaced = this.filterPlaced === ''
      ? undefined
      : this.filterPlaced === 'true';

    this.adminService.getStudents(undefined, undefined, isPlaced).subscribe({
      next: (res) => {
        this.students = res.data;
        this.filteredStudents = res.data;
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  applyFilter(): void {
    this.filteredStudents = this.students.filter(s => {
      const matchSearch =
        s.name?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.email?.toLowerCase().includes(this.searchText.toLowerCase()) ||
        s.rollNumber?.toLowerCase().includes(this.searchText.toLowerCase());

      const matchPlaced =
        this.filterPlaced === '' ||
        String(s.isPlaced) === this.filterPlaced;

      return matchSearch && matchPlaced;
    });
  }

  onFilterChange(): void {
    this.loadStudents();
  }

  getSkills(skills: string): string[] {
    if (!skills) return [];
    return skills.split(',').map(s => s.trim()).filter(Boolean);
  }

        getPlacedCount(): number {
        return this.filteredStudents.filter(s => s.isPlaced).length;
    }
    viewStudent(userId: number): void {
    this.router.navigate(['/admin/students', userId]);
    }

}