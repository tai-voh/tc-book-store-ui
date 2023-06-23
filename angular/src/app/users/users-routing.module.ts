import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent, title: 'Login' },
  { path: 'register', pathMatch: 'full', component: RegisterComponent, title: 'Register' },
  { path: 'logout', pathMatch: 'full', component: LogoutComponent, title: 'Logout' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
