import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {}

  formBuilderGroup: any;
  submitted = false;
  isLoading = false;

  showWrongCredentialAlert = false;
  errorMessage = '';

  ngOnInit(): void {
    this.formBuilderGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  get f() {
    return this.formBuilderGroup.controls;
  }

  loginUser() {
    this.submitted = true;
    this.showWrongCredentialAlert = false;
    this.errorMessage = '';
    if (this.formBuilderGroup.invalid) return;

    this.isLoading = true;
    const body = { email: this.f.email.value, password: this.f.password.value };
    console.log(body);

    this.authService.login(body).subscribe({
      next: (value) => {
        console.log(value?.body);

        this.submitted = false;
        this.isLoading = false;

        this.router.navigate(['dashboard']);
      },
      error: (err: any) => {
        console.log(err);

        this.showWrongCredentialAlert = true;
        this.errorMessage = err.error?.message ?? '';
        this.isLoading = false;
      },
    });
  }
}
