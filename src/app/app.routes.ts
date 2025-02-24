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
 
 
   // {path :'dashboard',component: DashboardComponent},
    {
        path: 'dashboard',
        component:DashboardComponent, // this is the component with the <router-outlet> in the template
        children: [
          {path: "home", component:HomeComponent},
          {
            path: 'viewPatients', // child route path
            component: ViewPatientsComponent, // child route component that the router renders
          },
          {
            path: 'patientForm',
            component: PatientRegistrationComponent, // another child route component that the router renders
          },
          {path: 'edit-patient/:id', component:PatientRegistrationComponent},
          {path:'',
            redirectTo: 'viewPatients',
            pathMatch:'full'
          }
        ],
      },
  /*  {path:'viewPatients',component :ViewPatientsComponent},
    {path :'patientForm',component:PatientFormComponent},*/
    // {path: 'edit-patient/:id', component:EditPatientComponent}
];
 