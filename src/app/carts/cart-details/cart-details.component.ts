import {Component, ViewChild} from '@angular/core';
import { MatTable } from '@angular/material/table';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../_service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartsService, CartState, reponseItem, Item } from '../../_service/carts.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent {
  public myForm: FormGroup;
  private cartSubscription: Subscription;
  errorMessage = '';
  userId = '';
  cartId = '';
  invalid = true;
  cartItems: reponseItem[];
  subTotal = 0;
  displayedColumns: string[] = ['id', 'title', 'quantity', 'stockQuantity', 'price', 'total', 'remove'];
  

  @ViewChild(MatTable) table: MatTable<reponseItem>;

  constructor(private authService: AuthService, private cartsService: CartsService, private _snackBar: MatSnackBar, private router: Router, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    if (!this.cartSubscription) {
      this.cartSubscription = this.cartsService.CartState.subscribe((state: CartState) => {
        this.userId = state.userId;
        this.cartId = state.cartId;
        this.cartItems = state.items.map(
          (e:any, index: number) => ({
            ...e,
            no: index + 1,
            total: e.quantity * e.price
          })
        );
        this.countSubTotal();
      });
    }
  }

  setCardItems() {

  }

  countSubTotal() {
    if (this.cartItems?.length) {
      this.subTotal = this.cartItems.reduce((accumulator, item) => {
        return accumulator += item.quantity * item.price;
      }, 0)
    }
  }

  getFormControlsFields(items:reponseItem[]) {
    const formGroupFields:any = {};
    for (const item of items) {
      formGroupFields['quantity_' + item.productId] = new FormControl(item.quantity, [Validators.required, Validators.min(0), Validators.max(item.stockQuantity)]);
      formGroupFields['remove_' + item.productId] = new FormControl(false);
    }
    return formGroupFields;
  }

  setForm() {
    this.myForm = new FormGroup(this.getFormControlsFields(this.cartItems));
    if (this.myForm && !this.myForm.invalid) {
      this.invalid = false;
    }
  }

  ngAfterViewChecked() {    
    if (!this.myForm && this.cartItems && this.cartItems.length) {
      this.setForm();
      this.cdRef.detectChanges();
    }
  }

  public myError = (controlName: string, errorName: string) =>{
    if (errorName == 'invalid') {
      return this.myForm.controls[controlName].invalid;
    }
    return this.myForm.controls[controlName].hasError(errorName);
  }

  getItemToUpdate(i:any) {
    if (this.myForm.controls['remove_' + i.productId].value) {
      return {
        productId: i.productId,
        quantity: 0
      };
    }
    else {
      return {
        productId: i.productId,
        quantity: this.myForm.controls['quantity_' + i.productId].value
      };
    }    
  }

  onUpdate() {
    if (this.userId && this.cartId && this.cartItems?.length) {
      const items: any = [];

      for (const i of this.cartItems) {
        if (this.myForm.controls['remove_' + i.productId].value) {
          items.push({
            productId: i.productId,
            quantity: 0
          });
        }
        else {
          items.push({
            productId: i.productId,
            quantity: this.myForm.controls['quantity_' + i.productId].value
          });
        }
      }
      
      this.cartsService.update(this.cartId, this.userId, items, true).subscribe({
        next: (data) => {
          MessageToastComponent.showMessage(this._snackBar, 'Updated cart successfully!');
          if (this.cartItems.length) {
            this.setForm();
          }
          else {
            this.myForm = new FormGroup({});
            this.invalid = true;
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Updating cart information failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      });
    }
  }

  onCheckout() {
    this.router.navigate(['/carts/checkout']);
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}