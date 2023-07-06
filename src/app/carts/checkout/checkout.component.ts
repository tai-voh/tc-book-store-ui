import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { OrdersService, customerInfo } from '../../_service/orders.service';
import { CartsService, CartState, reponseItem } from '../../_service/carts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})

export class CheckoutComponent implements OnInit {
  public myForm: FormGroup;
  private cartSubscription: Subscription;
  errorMessage = '';
  userId = '';
  cartId = '';
  cartItems:any = [];

  constructor(private router: Router, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private ordersService: OrdersService, private cartsService: CartsService) { }

  ngOnInit() { 
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/users/login']);
    }
    const user = this.tokenStorage.getUser();
    this.userId = user.id;

    this.cartSubscription = this.cartsService.CartState.subscribe((state: CartState) => {
      this.cartId = state.cartId;
      this.cartItems = state.items;
    });

    this.myForm = new FormGroup({
      firstName: new FormControl(user.firstName, [Validators.required, Validators.maxLength(30)]),
      lastName: new FormControl(user.lastName, [Validators.required, Validators.maxLength(30)]),
      email: new FormControl(user.email, [Validators.required, Validators.email]),
      tel: new FormControl('', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      address: new FormControl('', [Validators.required, Validators.maxLength(150)])
    });

    setTimeout(() => {
      if (!this.cartItems?.length) {
        this.router.navigate(['/']);
      }
    }, 5000);
  }
  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  onSubmit() {
    const customerInfoKeys = ['firstName', 'lastName', 'email', 'tel', 'address'];
    const customerInfo:any = {};
    customerInfoKeys.forEach(i => {
      customerInfo[i] = this.myForm.controls[i].value;
    })
    this.ordersService.add(this.userId, this.cartId, customerInfo).subscribe({
      next: (data:any) => {
        this.cartsService.erase();
        MessageToastComponent.showMessage(this._snackBar, 'Checkout successfully!');
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1000);
      },
      error: (err:any) => {
        this.errorMessage = err.error.message ? err.error.message : 'Checkout failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }
}