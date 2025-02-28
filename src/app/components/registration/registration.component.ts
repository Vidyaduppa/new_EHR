import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { CommonModule } from '@angular/common';
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
import { timestamp } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service'; // Import the AuthService

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    ButtonModule,
    SelectButtonModule,
    RadioButtonModule,
    ListboxModule,
    FloatLabelModule,
    DatePickerModule,
    CheckboxModule,
    AvatarModule,
    CardModule,
    TableModule,
    MenuModule,
    ToastModule,
    InputTextModule,
    MultiSelectModule,
    FormsModule,
    SelectModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    DrawerModule,
  ],
  standalone: true,
  providers:[MessageService]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  submitted = false;
  backendErrorMessage: string | null = null; // To store backend error messages
 
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,private authservice:AuthService) {}
 
  ngOnInit(): void {
    this.registrationForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.maxLength(35), this.alphabetValidator()]],
        last_name: ['', [Validators.required, Validators.maxLength(35), this.alphabetValidator()]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(8),
            this.passwordStrengthValidator(),
          ],
        ],
        confirm_password: ['', [Validators.required]],
        terms: [false, Validators.requiredTrue],
      },
      { validators: this.passwordMatchValidator } // Apply custom validator
    );
  }
 
  // Custom validator for alphabet-only fields
  alphabetValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const isAlphabet = /^[A-Za-z\s]+$/.test(value);
      return !isAlphabet ? { alphabet: true } : null;
    };
  }
 
  // Custom validator for password strength
  passwordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
      return !passwordValid ? { passwordStrength: true } : null;
    };
  }
 
  // Custom validator for password matching
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirm_password')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
 
  onSubmit() {
    this.submitted = true;
    this.backendErrorMessage = null; // Reset backend error message
 
    // Trim all input fields
    this.registrationForm.patchValue({
      first_name: this.registrationForm.value.first_name.trim(),
      last_name: this.registrationForm.value.last_name.trim(),
      email: this.registrationForm.value.email.trim(),
      password: this.registrationForm.value.password.trim(),
      confirm_password: this.registrationForm.value.confirm_password.trim(),
    });
 
    if (this.registrationForm.invalid) {
      console.log('Please provide valid details');
      return;
    }
 
    const { first_name, last_name, email, password } = this.registrationForm.value;
 

    // Call the service method for registration
    this.authservice.register({ first_name, last_name, email, password }).subscribe({
      next: (response) => {
        console.log('Registration Successful', response);
        alert('Registration successful!');
        this.registrationForm.reset();
        this.submitted = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Registration Failed', error);

        // Handle backend error messages
        if (error.status === 400 && error.error?.error?.message) {
          this.backendErrorMessage = error.error.error.message;
        } else if (error.status === 409 || error.error?.message?.includes('already exists')) {
          this.backendErrorMessage = 'This email already exists. Please use a different email.';
        } else {
          this.backendErrorMessage = 'Registration failed. Please try again.';
        }
      },
    });
  }
}
