import { NgModule } from '@angular/core';
import { OrdersRoutingModule } from './orders-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import {NgIf, CommonModule} from '@angular/common';
import { OrderListComponent } from './order-list/order-list.component';
import { CurrencyPipe } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';



const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatButtonModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule
];

@NgModule({
  imports: [OrdersRoutingModule, ReactiveFormsModule, NgIf, CommonModule, CurrencyPipe, ...moduleAngularMaterial],
  exports: [],
  declarations: [OrderListComponent, OrderDetailComponent],
  providers: [],
})
export class OrdersModule { }
