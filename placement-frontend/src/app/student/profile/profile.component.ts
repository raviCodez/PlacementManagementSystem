import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StudentService } from '../student.service';
import { StudentSummaryResponse } from '../../core/models/student.model';
import { MatDivider } from "@angular/material/divider";

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDivider
],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class StudentProfileComponent implements OnInit {

  profile: StudentSummaryResponse | null = null;
  profileForm: FormGroup;
  isLoading = true;
  isSaving = false;
  isUploading = false;
  selectedFile: File | null = null;

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.fb.group({
      cgpa:           ['', [Validators.min(0), Validators.max(10)]],
      marks10th:      ['', [Validators.min(0), Validators.max(100)]],
      marks12th:      ['', [Validators.min(0), Validators.max(100)]],
      backlogCount:   ['', Validators.min(0)],
      section:        [''],
      graduationYear: [''],
      skills:         ['']
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.studentService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data;
        this.isLoading = false;
        // Pre-fill the form with existing data
        this.profileForm.patchValue({
          cgpa:           this.profile.cgpa,
          backlogCount:   this.profile.backlogCount,
          section:        this.profile.section,
          skills:         this.profile.skills
        });
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSave(): void {
    if (this.profileForm.invalid) return;
    this.isSaving = true;

    const formValue = this.profileForm.value;

    // Convert comma-separated skills string to array
    const skillsArray = formValue.skills
      ? formValue.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : [];

    const updateData = { ...formValue, skills: skillsArray };

    this.studentService.updateProfile(updateData).subscribe({
      next: (res) => {
        this.isSaving = false;
        this.profile = res.data;
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000
        });
      },
      error: (err) => {
        this.isSaving = false;
        this.snackBar.open(
          err.error?.message || 'Update failed', 'Close', { duration: 3000 }
        );
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onUploadResume(): void {
    if (!this.selectedFile) return;
    this.isUploading = true;

    this.studentService.uploadResume(this.selectedFile).subscribe({
      next: (res) => {
        this.isUploading = false;
        this.snackBar.open('Resume uploaded successfully!', 'Close', {
          duration: 3000
        });
        if (this.profile) this.profile.resumeUrl = res.data;
      },
      error: (err) => {
        this.isUploading = false;
        this.snackBar.open(
          err.error?.message || 'Upload failed', 'Close', { duration: 3000 }
        );
      }
    });
  }

  getSkillsArray(): string[] {
    if (!this.profile?.skills) return [];
    return this.profile.skills.split(',').map(s => s.trim()).filter(Boolean);
  }
}