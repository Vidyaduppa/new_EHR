
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
    <p-toast></p-toast> <!-- Added Toast Component -->

    <div class="reset-password-container">
      <h2>Reset Password</h2>
      <input type="password" pInputText [(ngModel)]="newPassword" placeholder="New Password" />
      <input type="password" pInputText [(ngModel)]="confirmPassword" placeholder="Confirm Password" />
      <button pButton (click)="onSubmit()" label="Reset Password"></button>
    </div>
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
