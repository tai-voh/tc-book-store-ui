import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { OrdersService, orderItem, orderInfo } from '../../_service/orders.service';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';

export interface OrderElement {
  no: number,
  id: string;
  createdDate: string;
  items: any[];
  total: number;
}

@Component({
  selector: 'order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  displayedColumns: string[] = ['no', 'id', 'createdDate', 'items', 'total'];
  dataSource = new MatTableDataSource<OrderElement>();
  userId = '';
  errorMessage = '';
  length = 0;
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ordersService: OrdersService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar ) {}

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.userId = this.tokenStorage.getUser().id;
      this.ordersService.getByUser(this.userId, this.pageIndex + 1, this.pageSize)
        .subscribe({
          next: (data) => {
            if (data && data.data?.length) {
              const orderList = this.setDataSource(data.data)
              this.dataSource = new MatTableDataSource<OrderElement>(orderList);
              this.length = data.total;
            }
            else {
              this.length = 0;
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Get orders failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
      });
    }
  }

  getSubTotal(items: orderItem[]) {
    let total = 0;
    if (items) {
      total = items.reduce((accumulator: number, item: orderItem) => {
        return accumulator += (item.quantity * item.price)
      }, 0);
    }
    return total;
  } 

  setDataSource(items: orderInfo[]) {
    let result: OrderElement[];
    let no = 1;
    result = items.map(item => {
      const e: OrderElement = {
        no: (this.pageIndex * this.pageSize) + no,
        id: item.id,
        createdDate: item.createdDate || '',
        items: item.items || [],
        total: this.getSubTotal(item.items)
      };
      no++;
      return e;
    });
    return result;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.ordersService.getByUser(this.userId, this.pageIndex + 1, this.pageSize).subscribe({
      next: (data) => {
        if (data && data.data?.length) {
          const orderList = this.setDataSource(data.data)
          this.dataSource = new MatTableDataSource<OrderElement>(orderList);
          this.length = data.total;
        }
        else {
          this.length = 0;
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get books failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}