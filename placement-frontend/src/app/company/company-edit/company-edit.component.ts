import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CompanyService } from '../company.service';
import { DepartmentService } from '../../core/services/department.service';

@Component({
  selector: 'app-company-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  editForm: FormGroup;
  companyId!: number;
  isLoading = true;
  isSaving = false;
  departments: any[] = [];

  statusOptions = ['UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private companyService: CompanyService,
    private departmentService: DepartmentService,
    private snackBar: MatSnackBar
  ) {
    this.editForm = this.fb.group({
      name:                 ['', Validators.required],
      description:          [''],
      website:              [''],
      packageOffered:       ['', Validators.required],
      minimumCgpa:          ['', Validators.required],
      maxBacklogs:          [0],
      driveDate:            ['', Validators.required],
      driveLocation:        [''],
      registrationDeadline: [''],
      jobRole:              ['', Validators.required],
      jobDescription:       [''],
      status:               ['UPCOMING'],
      allowedDepartmentIds: [[], Validators.required]
    });
  }

  ngOnInit(): void {
    this.companyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadDepartments();
    this.loadCompany();
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (res) => { this.departments = res.data; },
      error: () => {}
    });
  }

  loadCompany(): void {
    this.companyService.getCompanyById(this.companyId).subscribe({
      next: (res) => {
        const c = res.data;
        this.editForm.patchValue({
          name:                 c.name,
          description:          c.description,
          website:              c.website,
          packageOffered:       c.packageOffered,
          minimumCgpa:          c.minimumCgpa,
          maxBacklogs:          c.maxBacklogs,
          driveDate:            c.driveDate,
          driveLocation:        c.driveLocation,
          registrationDeadline: c.registrationDeadline
            ? c.registrationDeadline.substring(0, 16) : '',
          jobRole:              c.jobRole,
          jobDescription:       c.jobDescription,
          status:               c.status
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSave(): void {
    if (this.editForm.invalid) return;
    this.isSaving = true;

    this.companyService.updateCompany(
      this.companyId, this.editForm.value
    ).subscribe({
      next: () => {
        this.isSaving = false;
        this.snackBar.open(
          'Company updated successfully!', 'Close', { duration: 3000 }
        );
        this.router.navigate(['/company', this.companyId]);
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open(
          err.error?.message || 'Update failed',
          'Close', { duration: 3000 }
        );
      }
    });
  }
}