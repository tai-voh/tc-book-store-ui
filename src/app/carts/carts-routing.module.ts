import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartDetailsComponent } from './cart-details/cart-details.component';
import { CheckoutComponent } from './checkout/checkout.component';

export const routes: Routes = [
  { path: 'details', pathMatch: 'full', component: CartDetailsComponent, title: 'Cart Detail' },
  { path: 'checkout', pathMatch: 'full', component: CheckoutComponent, title: 'Checkout' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CartsRoutingModule { }
