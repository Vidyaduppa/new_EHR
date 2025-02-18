import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
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
import { HttpClient, HttpClientModule } from '@angular/common/http';
 
import { AppComponent } from '../../app.component';
 
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports:[HttpClientModule,ReactiveFormsModule, RouterModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
  standalone: true
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup ;
  submitted = false;
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}
 
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(35)]],
    last_name: ['', [Validators.required, Validators.maxLength(35)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    terms: [false, Validators.requiredTrue],
  });
}
 
  // onSubmit(): void {
  //   if (this.registrationForm.valid) {
  //     console.log('Rigistration Successful', this.registrationForm.value);
  //     // Add your registration logic here (e.g., call an API)
  //   } else {
  //     console.log('Form is invalid');
  //   }
  // }
 
  onSubmit() {
    this.submitted = true;
 
    if (this.registrationForm.invalid) {
      console.log("please provide valid details");
    }
    var first_name: any,last_name: any,email: any,password: any;
    first_name= this.registrationForm.value.first_name;
    last_name = this.registrationForm.value.last_name;
    email = this.registrationForm.value.email;
    password = this.registrationForm.value.password;
 
 this.http.post('http://localhost:5000/api/auth/register', { first_name, last_name, email, password })
  .subscribe({
    next: (response) => {
      console.log('Registration Successful', response);
      alert('Registration successful!');
      this.registrationForm.reset();
      this.submitted = false;
      this.router.navigate(['/users']);
    },
    error: (error) => {
      console.error('Registration Failed', error);
      alert(`Registration failed: ${error.message}`);
    },
  });
  }
}