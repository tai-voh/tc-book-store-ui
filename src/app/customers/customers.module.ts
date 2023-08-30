import { NgModule } from '@angular/core';
import { CustomersRoutingModule } from './customers-routing.module';
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
import { CurrencyPipe } from '@angular/common';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';



const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatButtonModule,
  MatTableModule,
  MatCheckboxModule,
  MatPaginatorModule,
];

@NgModule({
  imports: [CustomersRoutingModule, ReactiveFormsModule, NgIf, CommonModule, CurrencyPipe, ...moduleAngularMaterial],
  exports: [],
  declarations: [CustomerListComponent, CustomerDetailComponent],
  providers: [],
})
export class CustomersModule { }
