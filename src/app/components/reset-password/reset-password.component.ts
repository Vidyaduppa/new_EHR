import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ToastModule, CommonModule, FormsModule, InputTextModule, ButtonModule, RouterModule],
  template: `
    <section class="bg-gray-50 dark:bg-gray-900 ">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a href="#" class="flex items-center mb-6">
              <img class="w-auto h-12 mr-2" src="images/logo.svg" alt="logo">
          </a>
          <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h2 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                      Reset Password
                  </h2>
                  <input type="password" pInputText [(ngModel)]="newPassword" placeholder="New Password" class="w-full" />
                  <input type="password" pInputText [(ngModel)]="confirmPassword" placeholder="Confirm Password" class="w-full" />
                  <button pButton (click)="onSubmit()" label="Reset Password" class="w-full"></button>
              </div>
          </div>
      </div>
    </section>
    <p-toast></p-toast>
  `,
  styles: [`
    .reset-password-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin: 2rem auto;
    }
  `],
  providers: [MessageService],
})
export class ResetPasswordComponent implements OnInit {
  newPassword: string = '';
  confirmPassword: string = '';
  token: string = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log("Extracted Token:", this.token);
  }

  onSubmit() {
    console.log("Submitting Reset Request with Token:", this.token);
    console.log("New Password:", this.newPassword);

    if (this.newPassword !== this.confirmPassword) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match'
      });
      return;
    }

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {
        console.log("Reset Success:", res);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset successful'
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error("Reset Error:", err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error?.message || 'Password reset failed'
        });
      }
    });
  }
}