import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';

@Component({
  selector: 'logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})

export class LogoutComponent implements OnInit {
  isLoggedIn = false;
  errorMessage = '';

  constructor(private router: Router, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/users/login']);
    }
  }

  public logOut(): void {
    this.tokenStorage.signOut();
    MessageToastComponent.showMessage(this._snackBar, 'Log out successfully!');
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}