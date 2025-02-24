import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { MultiSelectModule } from 'primeng/multiselect';
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
import { CommonModule } from '@angular/common';
import { AppComponent } from '../../app.component';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports:[CommonModule,NgClass,HttpClientModule,ReactiveFormsModule,ToastModule, RouterModule,ButtonModule, SelectButtonModule, RadioButtonModule, ListboxModule, FloatLabelModule, DatePickerModule, CheckboxModule, AvatarModule, CardModule, TableModule, AvatarGroupModule, MenuModule, ToastModule, InputTextModule, MultiSelectModule, FormsModule, SelectModule, TagModule,IconFieldModule, InputIconModule, DrawerModule],
  standalone: true,
  providers:[MessageService],
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup ;
  submitted = false;
  toastr: any;
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router ,private messageService:MessageService,private authservice:AuthService) {}
 
  ngOnInit(): void {
    this.registrationForm = this.fb.group({
    first_name: ['', [Validators.required, Validators.maxLength(35), Validators.pattern(/^[A-Za-z\s'-]+$/)]],
    last_name: ['', [Validators.required, Validators.maxLength(35), Validators.pattern(/^[A-Za-z\s'-]+$/)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/)]],
    terms: [false, Validators.requiredTrue],
  },{ validators: this.passwordMatchValidator }
);
}
 // Custom validator for password matching
 passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirm_password')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}

 

// 
onSubmit() {
  this.submitted = true;

  if (this.registrationForm.invalid) {
    console.log("please provide valid details");
  }
 
  const userData={
    first_name:this.registrationForm.value.first_name,
    last_name :this.registrationForm.value.last_name,
    email :this.registrationForm.value.email,
    password : this.registrationForm.value.password,
  }
  // Send registration data to the backend
  // this.http.post('http://localhost:5000/api/auth/register', {first_name,last_name,email,password})
  //   .subscribe({
  //     next: (response) => {
  //       console.log('Registration Successful', response);
  //       alert('Registration successful!');
  //       this.registrationForm.reset();
  //       this.submitted = false;
  //       this.router.navigate(['/login'])
  //     },
  //     error: (error) => {
  //       console.error('Registration Failed', error);
  //       alert('Registration failed. Please try again.');
  //     },
  //   });
    this.authservice.register(userData).subscribe({
         next: (response) =>{
          console.log('Registration Succesful', response);
          this.messageService.add({
            severity : 'success',
            summary : 'success',
            detail : 'Registration successful, redirecting to login page...',
          });
          setTimeout(()=>{
            this.router.navigate(['/login']);
          },2000);
         },
         error : (error)=>{
          console.log('Regitration failed', error);
          this.messageService.add({
            severity : 'error',
            summary : 'Error',
            detail : 'Registration failed. Please try again.',
          });
         },
    });
}
}
