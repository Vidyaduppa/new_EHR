import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { NgClass } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { DrawerModule } from 'primeng/drawer';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import {HttpClientModule} from '@angular/common/http';
import { PatientRegistrationComponent } from './components/patient-registration/patient-registration.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
@Component({
  selector: 'app-root',
  imports: [ResetPasswordComponent,ForgotPasswordComponent ,HomeComponent , HttpClientModule,PatientRegistrationComponent ,DashboardComponent ,LoginComponent,RegistrationComponent,ReactiveFormsModule,RouterModule,RouterOutlet,ButtonModule, SelectButtonModule, RadioButtonModule, MultiSelect, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule,CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule, NgClass, IconFieldModule, InputIconModule, DrawerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
 standalone:true
})
export class AppComponent implements OnInit {
  title = 'ehr-demo';
  // items = [
  //   {
  //     label: 'Options',
  //     items: [
  //       {
  //         label: 'Refresh',
  //         icon: 'pi pi-refresh'
  //       },
  //       {
  //         label: 'Export',
  //         icon: 'pi pi-upload'
  //       }
  //     ]
  //   }
  // ];
  // products = [
  //   {
  //     code: "f230fh0g3",
  //     name: "Bamboo Watch",
  //     category: "Accessories",
  //     quantity: 10
  //   },
  //   {
  //     code: "nvklal433",
  //     name: "Black Watch",
  //     category: "Accessories",
  //     quantity: 61
  //   },
  //   {
  //     code: "zz21cz3c1",
  //     name: "Blue Band",
  //     category: "Fitness",
  //     quantity: 1
  //   },
  //   {
  //     code: "244wgerg2",
  //     name: "Blue T-Shirt",
  //     category: "Clothing",
  //     quantity: 25
  //   },
  //   {
  //     code: "h456wer53",
  //     name: "Bracelet",
  //     category: "Accessories",
  //     quantity: 73
  //   },
  // ]
  // customers = [
  //   {
  //     name: "customers",
  //     country: "US",
  //     representative: "TEST",
  //     status: true
  //   }
  // ];
  representatives = [{ label: "edvak", name: "edvak" }];
  value = "";
  ingredient: any = '';
  visible = false
  constructor(private primeng: PrimeNG) { }

  ngOnInit(): void {
    this.primeng.ripple.set(true);
  }

  toggleDarkMode() {
    const element = document.querySelector('html');
    element && element.classList.toggle('dark-theme');
  }
}