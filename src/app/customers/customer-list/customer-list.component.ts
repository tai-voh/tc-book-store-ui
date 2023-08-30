import {AfterViewInit, Component, ViewChild} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CustomersService, customerInfo } from '../../_service/customers.service';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';

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
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss']
})
export class CustomerListComponent {
  displayedColumns: string[] = ['no', 'id', 'firstName', 'lastName', 'email', 'tel', 'address'];
  dataSource = new MatTableDataSource<CustomerElement>();
  userId = '';
  errorMessage = '';
  length = 0;
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  pageEvent: PageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private customersService: CustomersService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar ) {}

  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.userId = this.tokenStorage.getUser().id;
      this.customersService.getByUser(this.userId, this.pageIndex + 1, this.pageSize)
        .subscribe({
          next: (data) => {
            if (data && data.data?.length) {
              const customerList = this.setDataSource(data.data)
              this.dataSource = new MatTableDataSource<CustomerElement>(customerList);
              this.length = data.total;
            }
            else {
              this.length = 0;
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Get customers failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
      });
    }
  }

  setDataSource(items: customerInfo[]) {
    let result: CustomerElement[];
    let no = 1;
    result = items.map(item => {
      const e: CustomerElement = {
        no: (this.pageIndex * this.pageSize) + no,
        id: item.id,
        firstName: item.firstName || '',
        lastName: item.lastName || '',
        email: item.email || '',
        tel: item.tel || '',
        address: item.address || '',
      };
      no++;
      return e;
    });
    return result;
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.customersService.getByUser(this.userId, this.pageIndex + 1, this.pageSize).subscribe({
      next: (data) => {
        if (data && data.data?.length) {
          const customerList = this.setDataSource(data.data)
          this.dataSource = new MatTableDataSource<CustomerElement>(customerList);
          this.length = data.total;
        }
        else {
          this.length = 0;
        }
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get customers failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
