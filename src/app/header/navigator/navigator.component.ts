import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../../_service/token-storage.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'navigator',
  templateUrl: 'navigator.component.html',
  styleUrls: ['navigator.component.scss']
})

export class NavigatorComponent implements OnInit {
  name = '';
  admin = false;
  show = false;
  constructor(private tokenStorage: TokenStorageService, private cdRef: ChangeDetectorRef) { }

  ngOnInit() {}

  ngAfterViewChecked() {
    let show = this.loggedIn();
    if (show != this.show) { // check if it change, tell CD update view
      this.show = show;
      this.cdRef.detectChanges();
    }
  }

  loggedIn() {
    if (this.tokenStorage.getToken()) {
      if (!this.name) {
        this.name = this.tokenStorage.getUser().firstName;
      }
      if (!this.admin) {
        this.admin = this.tokenStorage.getUser().admin;
      }
      return true;
    }
    else {
      this.name = '';
      this.admin = false;
    }
    return false;
  }
}
