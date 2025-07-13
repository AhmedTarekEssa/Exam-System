import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environments';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  error = '';
  success = '';
  private apiUrl = environment.apiUrl;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, this.noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        this.passwordStrengthValidator
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  noWhitespaceValidator(control: any) {
    const isWhitespace = (control.value || '').indexOf(' ') >= 0;
    return isWhitespace ? { whitespace: true } : null;
  }

  passwordStrengthValidator(control: any) {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSymbol;
    return !valid ? { passwordStrength: true } : null;
  }

  matchPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  register() {
    if (this.registerForm.invalid) return;

    const { username, email, password } = this.registerForm.value;
    const newUser = { username, email, password, role: 'student' };

    this.http.post(`${this.apiUrl}/auth/register`, newUser).subscribe({
      next: () => {
        this.success = 'Registered successfully! Redirecting...';
        setTimeout(() => this.router.navigate(['/auth/login']), 1500);
      },
      error: () => this.error = 'Registration failed. Try again.'
    });
  }
}
