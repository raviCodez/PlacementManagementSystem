import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Auth routes (public)
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component').then(m => m.RegisterComponent)
  },

  // Unauthorized page
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },

  // Add these routes at the top level (outside student block)
{
  path: 'company',
  canActivate: [authGuard],
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./company/company-list/company-list.component')
          .then(m => m.CompanyListComponent)
    },
    {
      path: ':id',
      loadComponent: () =>
        import('./company/company-detail/company-detail.component')
          .then(m => m.CompanyDetailComponent)
    },
    {
      path: 'edit/:id',
      loadComponent: () =>
        import('./company/company-edit/company-edit.component')
          .then(m => m.CompanyEditComponent)  
    },
  ]
},



  // Protected routes (we'll add these in next steps)
{
  path: 'student',
  canActivate: [authGuard],
  children: [
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./student/dashboard/dashboard.component')
          .then(m => m.StudentDashboardComponent)
    },
    {
      path: 'profile',
      loadComponent: () =>
        import('./student/profile/profile.component')
          .then(m => m.StudentProfileComponent)
    },
    {
      path: 'applications',
      loadComponent: () =>
        import('./student/applications/applications.component')
          .then(m => m.ApplicationsComponent)
    },
    // Also add this inside the student children array
{
  path: 'companies',
  loadComponent: () =>
    import('./company/company-list/company-list.component')
      .then(m => m.CompanyListComponent)
},
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},
{
  path: 'admin',
  canActivate: [authGuard],
  children: [
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./admin/dashboard/admin-dashboard.component')
          .then(m => m.AdminDashboardComponent)
    },
    {
      path: 'students',
      loadComponent: () =>
        import('./admin/students/admin-students.component')
          .then(m => m.AdminStudentsComponent)
    },
    {
      path: 'applications',
      loadComponent: () =>
        import('./admin/applications/admin-applications.component')
          .then(m => m.AdminApplicationsComponent)
    },
    {
      path: 'students/:id',
      loadComponent: () =>
        import('./admin/students/student-detail/student-detail.component')
          .then(m => m.StudentDetailComponent)
    },


    { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
  ]
},

  // Catch-all
  { path: '**', redirectTo: 'login' }
];