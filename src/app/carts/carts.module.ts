import { NgModule } from '@angular/core';
import { CartsService } from '../_service/carts.service';
import { CartsRoutingModule } from './carts-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTable, MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgIf, CommonModule} from '@angular/common';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CurrencyPipe } from '@angular/common';



const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatButtonModule,
  MatTableModule,
  MatCheckboxModule
];

@NgModule({
  imports: [CartsRoutingModule, ReactiveFormsModule, NgIf, CommonModule, CurrencyPipe, ...moduleAngularMaterial],
  exports: [],
  declarations: [CartDetailsComponent, CheckoutComponent],
  providers: [],
})
export class CartsModule { }
