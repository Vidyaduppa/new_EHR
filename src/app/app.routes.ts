import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'register', component: RegistrationComponent } ,// Corrected path syntax
  {path:'dashboard',component:DashboardComponent},
  { path: 'Login', component: LoginComponent },
  {path:'patient',component:PatientRegistrationComponent},
  { path: 'viewpatients', redirectTo: '/view-patients', pathMatch: 'full' }]
