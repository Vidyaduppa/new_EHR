import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ViewPatientsComponent } from './components/view-patients/view-patients.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { HomeComponent } from './components/home/home.component';
import { Component } from '@angular/core';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth.guard'; // Import the Auth Guard
 
export const routes: Routes = [
    {path :'',component: LoginComponent},
    {path :'register',component: RegistrationComponent},
    {path :'login',component: LoginComponent},
    { 
      path: 'forgot-password', 
      component: ForgotPasswordComponent 
    },
    { 
      path: 'reset-password/:token', 
      component: ResetPasswordComponent 
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
      canActivate: [AuthGuard], // Protect Dashboard
      children: [
          { path: 'home', component: HomeComponent },
          { path: 'viewPatients', component: ViewPatientsComponent },
          { path: 'patientForm', component: PatientRegistrationComponent },
          { path: 'edit-patient/:id', component: PatientRegistrationComponent, },
          { path: '', redirectTo: 'viewPatients', pathMatch: 'full' }
      ]
  }
];
 