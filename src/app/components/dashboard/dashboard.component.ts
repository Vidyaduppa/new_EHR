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
import { MenuItem } from 'primeng/api';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { PatientRegistrationComponent } from '../patient-registration/patient-registration.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [ NgClass,PatientRegistrationComponent,RouterLink, RouterModule, ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule, IconFieldModule, InputIconModule, DrawerModule],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  items: MenuItem[] = []; // Menu items for the dropdown
  userEmail: string = ''; // Logged-in user's email
  userEmailInitial: string = ''; // Initial for the avatar
  menuOpen: boolean = false; // State for sidebar toggle
  constructor(private authService: AuthService, private router: Router) {}
 
  ngOnInit(): void {
    // Fetch the logged-in user's email (example)
    this.userEmail = this.authService.getUserEmail(); // Replace with your logic
    this.userEmailInitial = this.userEmail.charAt(0).toUpperCase(); // Get the first letter for the avatar
  console.log('User email:', this.userEmail);
    // Define menu items
    this.items = [
      {
        label: this.userEmail, // Display the user's email
        icon: 'pi pi-user',
        disabled: true, // Disable clicking on the email
      },
      {
        separator: true, // Add a separator
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: () => this.logout(), // Call the logout method
      },
    ];
  }
   // Toggle sidebar visibility
   toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
  // Logout method
  logout(): void {
    this.authService.logout(); // Call your logout service
    this.router.navigate(['/login']); // Redirect to the login page
  }
}