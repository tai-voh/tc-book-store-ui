import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OrdersService } from '../../_service/orders.service';
import { CartsService, CartState, reponseItem } from '../../_service/carts.service';
import { CustomersService, customerInfo } from '../../_service/customers.service';
import { Subscription } from 'rxjs';

export interface CustomerElement {
  no: number,
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  tel: string,
  address: string,
}

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
  customer: any = {};
  displayedColumns: string[] = ['no', 'firstName', 'lastName', 'email', 'tel', 'address', 'id'];
  length = 0;
  dataSource = new MatTableDataSource<CustomerElement>();
  disabled =  1;

  constructor(private router: Router, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private ordersService: OrdersService, private cartsService: CartsService, private customersService: CustomersService) { }

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

    this.setForm();

    setTimeout(() => {
      if (!this.cartItems?.length) {
        this.router.navigate(['/']);
      }
    }, 5000);

    this.customersService.getByUser(this.userId, 1, 100)
        .subscribe({
          next: (data) => {
            if (data && data.data?.length) {
              const customerList = this.setDataSource(data.data)
              this.dataSource = new MatTableDataSource<CustomerElement>(customerList);
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Get customers failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
      });
  }

  setForm() {
    this.myForm = new FormGroup({
      firstName: new FormControl(this.customer?.firstName || '', [Validators.required, Validators.maxLength(30)]),
      lastName: new FormControl(this.customer?.lastName || '', [Validators.required, Validators.maxLength(30)]),
      email: new FormControl(this.customer?.email || '', [Validators.required, Validators.email]),
      tel: new FormControl(this.customer?.tel || '', [Validators.required, Validators.pattern('[- +()0-9]+')]),
      address: new FormControl(this.customer?.address || '', [Validators.required, Validators.maxLength(150)])
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  setDataSource(items: customerInfo[]) {
    let result: CustomerElement[];
    let no = 1;
    result = items.map(item => {
      const e: CustomerElement = {
        no: no,
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        tel: item.tel || '',
        address: item.address || '',
        id: item.id,
      };
      if (no == 1) {
        this.onChoose(item);
      }
      no++;
      return e;
    });
    return result;
  }

  onChoose(e:any) {
    this.customer = {
      id: e.id,
      firstName: e.firstName,
      lastName: e.lastName,
      email: e.email,
      tel: e.tel,
      address: e.address
    }
    this.setForm();
  }

  onSubmit() {
    // const customerInfoKeys = ['firstName', 'lastName', 'email', 'tel', 'address'];
    // const customerInfo:any = {};
    // customerInfoKeys.forEach(i => {
    //   customerInfo[i] = this.myForm.controls[i].value;
    // })
    this.ordersService.add(this.userId, this.cartId, this.customer.id).subscribe({
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