import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';

export const routes: Routes = [
  { path: 'list', pathMatch: 'full', component: CustomerListComponent, title: 'Customer List' },
  { path: 'add', pathMatch: 'full', component: CustomerDetailComponent, title: 'Add Customer' },
  { path: 'detail/:customerId', pathMatch: 'full', component: CustomerDetailComponent, title: 'Customer Detail' }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
