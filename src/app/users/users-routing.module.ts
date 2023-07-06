import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LogoutComponent } from './logout/logout.component';
import { UserListComponent } from './user-list/user-list.component';
import { AuthGuard, AdminAuthGuard } from '../_service/auth.guard.service';

export const routes: Routes = [
  { path: 'login', pathMatch: 'full', component: LoginComponent, title: 'Login' },
  { path: 'register', pathMatch: 'full', component: RegisterComponent, title: 'Register' },
  { path: 'logout', pathMatch: 'full', component: LogoutComponent, title: 'Logout', canActivate: [AuthGuard] },
  { path: 'list', pathMatch: 'full', component: UserListComponent, title: 'User List', canActivate: [AdminAuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
