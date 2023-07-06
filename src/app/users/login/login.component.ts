import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../_service/auth.service';
import { TokenStorageService } from '../../_service/token-storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router, ActivatedRoute  } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss']
})

export class LoginComponent implements OnInit {
  public myForm: FormGroup;
  hide = true;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() { 
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
    if (this.tokenStorage.getToken()) {
      this.router.navigate(['/']);
    }
  }
  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    const { email, password } = this.myForm.value;
    this.authService.login(email, password).subscribe({
      next: (data) => {
        this.tokenStorage.saveToken(data.token);
        this.tokenStorage.saveUser(data);

        MessageToastComponent.showMessage(this._snackBar, 'Logged in successfully!');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        setTimeout(() => {
          this.router.navigateByUrl(returnUrl);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Login failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }
}