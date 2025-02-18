import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { ViewPatientsComponent } from './components/view-patients/view-patients.component';

export const routes: Routes = [
  { path: '', component: LoginComponent }, // Default route
  { path: 'register', component: RegistrationComponent } ,// Corrected path syntax
  {path:'dashboard',component:DashboardComponent},
  { path: 'login', component: LoginComponent },
  {path:'patient',component:PatientRegistrationComponent},
  {path:'edit-patient/:id',component:PatientRegistrationComponent},
  { path: 'view' , component:ViewPatientsComponent}]
