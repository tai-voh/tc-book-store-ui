import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage.service';
import { CartsService, CartState, reponseItem } from '../../_service/carts.service';
import { ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';

@Component({
  selector: 'navigator',
  templateUrl: 'navigator.component.html',
  styleUrls: ['navigator.component.scss'],
  providers: []
})

export class NavigatorComponent implements OnInit {
  name = '';
  userId = '';
  admin = false;
  show = false;
  errorMessage = '';
  private cartSubscription: Subscription;
  cartId = '';
  cartItems: reponseItem[];
  cartTotal = 0;

  constructor(private router: Router, private tokenStorage: TokenStorageService, private cartsService: CartsService, private cdRef: ChangeDetectorRef,  private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.cartSubscription = this.cartsService.CartState.subscribe((state: CartState) => {
      this.cartId = state.cartId;
      this.cartItems = state.items;
    });

    if (this.tokenStorage.getToken() && !this.cartId) {
      const userId = this.tokenStorage.getUser().id;
      this.cartsService.getOneByUser(userId).subscribe({
        next: (data) => {
          if (data) {
            this.cartTotal = this.countItems(data.items);
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Getting cart information failed!';
          if (this.errorMessage != 'Not found') {
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
        }
      });
    }
  }

  ngAfterViewChecked() {
    let show = this.loggedIn();
    let changed = false;
    const itemTotal = this.countItems(this.cartItems);
    // check if it change, tell CD update view
    if (show != this.show) { 
      this.show = show;
      changed = true;
      if (!this.userId) {
        this.cartsService.erase();
      }
      else {
        this.cartsService.getOneByUser(this.userId).subscribe({
          next: (data) => {
            if (data) {
              this.cartTotal = this.countItems(data.items);
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Getting cart information failed!';
            if (this.errorMessage != 'Not found') {
              MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
            }
          }
        });
      }
    }
    else if (this.cartTotal != itemTotal) {
      this.cartTotal = itemTotal;
      changed = true;
    }
    if (changed) {
      this.cdRef.detectChanges();
    }
  }

  loggedIn() {
    if (this.tokenStorage.getToken()) {
      if (!this.userId) {
        this.userId = this.tokenStorage.getUser().id;
      }
      if (!this.name) {
        this.name = this.tokenStorage.getUser().firstName;
      }
      if (!this.admin) {
        this.admin = this.tokenStorage.getUser().admin;
      }
      return true;
    }
    else {
      this.userId = '';
      this.name = '';
      this.admin = false;
    }
    return false;
  }

  countItems(items: any[]) {
    let total = 0;
    if (items) {
      items.forEach(i => {
        total += i.quantity;
      });
    }
    return total;
  }

  onViewCart() {
    if (!this.name) {      
      MessageToastComponent.showMessage(this._snackBar, 'Please log in to see your card');
      setTimeout(() => {
        this.router.navigate(['/users/login']);
      }, 500);
    }
    else {
      this.router.navigate(['/carts/details']);
    }
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
