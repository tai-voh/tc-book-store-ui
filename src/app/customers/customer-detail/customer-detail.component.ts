import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { AbstractControl, FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { CustomersService, customerInfo } from '../../_service/customers.service';
import { Subscription } from 'rxjs';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss']
})
export class CustomerDetailComponent implements OnInit {
  public myForm: FormGroup;
  customerId = '';
  customer: any = {};
  userId = '';
  errorMessage = '';

  constructor(private router: Router, private activeRoute: ActivatedRoute, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private customersService: CustomersService) { }

  ngOnInit() {
    if (!this.tokenStorage.getToken()) {
      this.router.navigate(['/users/login']);
    }
    const user = this.tokenStorage.getUser();
    this.userId = user.id;

    this.setForm();
    this.customerId = this.activeRoute.snapshot.paramMap.get('customerId') || '';
    if (this.customerId) {
      this.customersService.getOne(this.customerId)
      .subscribe({
        next: (data) => {
          if (data) {
            this.customer = data;
            this.setForm();
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Get customer failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
    });
    }
    else {
      this.setForm();
    }
  }

  setForm() : void {
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

  onSubmit() {
    const customerInfoKeys = ['firstName', 'lastName', 'email', 'tel', 'address'];
    const customerInfo: any = [];
    customerInfoKeys.forEach(i => {
      customerInfo[i] = this.myForm.controls[i].value;
    });
    if (this.customerId) {
      this.customersService.update(this.customerId, customerInfo.firstName, customerInfo.lastName, customerInfo.email, customerInfo.tel, customerInfo.address).subscribe({
        next: (data:any) => {
          MessageToastComponent.showMessage(this._snackBar, 'Update successfully!');
        },
        error: (err:any) => {
          this.errorMessage = err.error.message ? err.error.message : 'Update failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      });
    }
    else {
      this.customersService.add(customerInfo.firstName, customerInfo.lastName, customerInfo.email, customerInfo.tel, customerInfo.address, this.userId).subscribe({
        next: (data:any) => {
          MessageToastComponent.showMessage(this._snackBar, 'Adding successfully!');
        },
        error: (err:any) => {
          this.errorMessage = err.error.message ? err.error.message : 'Adding failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      });
    }
  }
}
