// forgot-password.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../services/auth.service';
import { MessageService } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { ToastModule } from 'primeng/toast';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [ToastModule,CommonModule ,FormsModule, InputTextModule, ButtonModule, RouterModule],
  template: `
    <p-toast></p-toast> <!-- Added Toast Component -->

    <div class="forgot-password-container">
      <h2>Forgot Password</h2>
      <input type="email" pInputText [(ngModel)]="email" placeholder="Enter your email" />
      <button pButton (click)="onSubmit()" label="Send Reset Link"></button>
      <a routerLink="/login">Back to Login</a>
    </div>
  `,
  styles: [`
    .forgot-password-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 400px;
      margin: 2rem auto;
    }
  `],
  providers:[MessageService],
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(
    private authService: AuthService,
    private messageService: MessageService
  ) {}

  onSubmit() {
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset link sent to your email'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Password reset link sent '
        });
      }
    });
  }
}