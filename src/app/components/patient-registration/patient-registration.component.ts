import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { PrimeNG } from 'primeng/config';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect, MultiSelectModule } from 'primeng/multiselect';
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
import { DrawerModule } from 'primeng/drawer';
import { RouterLink, RouterModule } from '@angular/router';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputSwitchModule } from 'primeng/inputswitch';
@Component({
  selector: 'app-patient-Registration',
  templateUrl: './patient-Registration.component.html',
  styleUrls: ['./patient-Registration.component.scss'],
  imports: [InputSwitchModule,DropdownModule,RouterLink, RouterModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
 
})
export class PatientRegistrationComponent implements OnInit {
 
 
  patient: any = {
    first_name: '',
    last_name: '',
    email: '',
    mobile_phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'US',
    notes: '',
    dob: '',
    gender: '',
    allowShare: false,
    status: true,
  };
  onStatusChange(event: any) {console.log('Status changed:', this.patient.status ? 'Active' : 'Inactive');}
 
  cities = [
    { name: 'New York' },
    { name: 'Los Angeles' },
    { name: 'Chicago' },
  ];
 
  states = [
    { name: 'California' },
    { name: 'Texas' },
    { name: 'Florida' },
  ];
 
  countries = [
    { name: 'United States' },
    { name: 'Canada' },
    { name: 'United Kingdom' },
  ];
 
  constructor() {}
 
 
  ngOnInit(): void {}
 
  onSubmit(): void {
    console.log('Form Submitted', this.patient);
    // Add your form submission logic here (e.g., call an API)
  }
}
