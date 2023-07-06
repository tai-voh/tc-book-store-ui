import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { TokenStorageService } from './token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../utilities/message-toast/message-toast.component';

const AUTH_API = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const userId = this.tokenStorage.getUser()?.id;
    if (userId) {
        // authorised so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    MessageToastComponent.showMessage(this._snackBar, 'Please log in to access this page');
    this.router.navigate(['/users/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
  constructor(private router: Router, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const admin = this.tokenStorage.getUser()?.admin;
    if (admin) {
        return true;
    }

    // not logged in so redirect to login page with the return url
    MessageToastComponent.showMessage(this._snackBar, 'Please log in as administrator to access this page');
    this.router.navigate(['/users/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }
}