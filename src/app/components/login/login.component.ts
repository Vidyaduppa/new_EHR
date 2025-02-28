import { Component } from '@angular/core';
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
import { NgClass, NgIf } from '@angular/common';
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
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { DashboardComponent } from '../dashboard/dashboard.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [ NgIf,NgClass,DashboardComponent,RouterLink,RouterModule,ButtonModule, SelectButtonModule, HttpClientModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
  providers: [MessageService],
})
export class LoginComponent {
  loginFailed: boolean = false;
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  // onLogin() {
  //   // Convert email to lowercase for case-insensitive login
  //   const caseInsensitiveEmail = this.email.toLowerCase();

  //   this.authService.login(caseInsensitiveEmail, this.password).subscribe({
  //     next: (response: any) => {
  //       console.log('Login successful - Full response:', response);

  //       // Ensure token exists in response
  //       if (response && response.token) {
  //         localStorage.setItem('authToken', response.token);

  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Login successful, redirecting to main page...',
  //         });

  //         setTimeout(() => {
  //           this.router.navigate(['/dashboard/home']);
  //         }, 2000);
  //       } else {
  //         console.error('Token not found in response:', response);
  //         alert('Token not found in response. Please check the backend API.');
  //       }
  //     },
  //     error: (error: any) => {
  //       console.error('Login failed:', error);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Login failed. Please check your credentials.',
  //       });
  //     },
  //   });
  // }
  onLogin() {
    const caseInsensitiveEmail = this.email.toLowerCase();
  
    this.authService.login(caseInsensitiveEmail, this.password).subscribe({
      next: (response: any) => {
        console.log('Login successful - Full response:', response);
        this.loginFailed = false; // Reset login failure flag
  
        if (response && response.token) {
          localStorage.setItem('authToken', response.token);
  
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Login successful, redirecting to main page...',
          });
  
          setTimeout(() => {
            this.router.navigate(['/dashboard/home']);
          }, 2000);
        } else {
          console.error('Token not found in response:', response);
          alert('Token not found in response. Please check the backend API.');
        }
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        this.loginFailed = true; // Set flag to show error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Login failed. Please check your credentials.',
        });
      },
    });
  }
  
}