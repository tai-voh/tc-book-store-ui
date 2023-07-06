import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../_service/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss']
})

export class RegisterComponent implements OnInit {
  public myForm: FormGroup;
  hide = true;
  hide2 = true;
  errorMessage = '';

  constructor(private authService: AuthService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() { 
    this.myForm = new FormGroup({
      firstName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      lastName: new FormControl('', [Validators.required, Validators.maxLength(30)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z])(?=.*[!@#$%^&*]).{5,}$')]),
      confirmPassword: new FormControl('', [Validators.required]),
      adminCode: new FormControl('', [Validators.maxLength(6)]),
    },
    { validators: confirmPasswordValidator });
  }
  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    const { firstName, lastName, email, password, adminCode } = this.myForm.value;

    var admin = false;
    if (adminCode && adminCode === environment.adminCode) {
      admin = true;
    }

    this.authService.register(firstName, lastName, email, password, admin).subscribe({
      next: (data) => {
        MessageToastComponent.showMessage(this._snackBar, 'Registration success!');
        setTimeout(() => {
            this.router.navigate(['/users/login']);
          }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Registration failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.value && confirmPassword?.value && password.value !== confirmPassword.value) {
    control.get('confirmPassword')?.setErrors({match: true});
    return { confirmPassword: true };
  }
  else {
    return null;
  }
}