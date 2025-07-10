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
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  error = '';
  success = '';
  private apiUrl = environment.apiUrl; // Use environment variable for API URL

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
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

