import { Component } from '@angular/core';
import {CurrencyPipe} from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { OrdersService, orderItem, orderInfo } from '../../_service/orders.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { ActivatedRoute, Router } from '@angular/router';

export interface Transaction {
  item: string;
  cost: number;
}

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent {
  orderId = '';
  orderInfo: any = {};
  displayedColumns = ['title', 'quantity', 'price', 'total'];
  errorMessage = '';

  constructor(private ordersService: OrdersService, private _snackBar: MatSnackBar, private activeRoute: ActivatedRoute, private router: Router ) {}

  ngOnInit() {
    this.orderId = this.activeRoute.snapshot.paramMap.get('orderId') || '';
    if (this.orderId) {
      this.ordersService.getOne(this.orderId)
      .subscribe({
        next: (data) => {
          if (data && data.items?.length) {
            this.orderInfo = data;
            this.orderInfo.customerInfo = this.orderInfo.customer;
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Get orders failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
    });
    }
    else {
      this.router.navigate(['/']);
    }
  }

  getSubTotal() {
    let total = 0;
    if (this.orderInfo.items) {
      total = this.orderInfo.items.reduce((accumulator: number, item: orderItem) => {
        return accumulator += (item.quantity * item.price)
      }, 0);
    }
    return total;
  }
}
