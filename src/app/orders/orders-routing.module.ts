import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const routes: Routes = [
  { path: 'list', pathMatch: 'full', component: OrderListComponent, title: 'Order List' },
  { path: 'detail/:orderId', pathMatch: 'full', component: OrderDetailComponent, title: 'Order Detail' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrdersRoutingModule { }
