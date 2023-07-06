import { NgModule } from '@angular/core';
import { UsersRoutingModule } from './users-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { UserListComponent } from './user-list/user-list.component';


const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatPaginatorModule,
  MatTableModule,
  MatDialogModule
];

@NgModule({
  imports: [UsersRoutingModule, ReactiveFormsModule, NgIf, ...moduleAngularMaterial],
  exports: [],
  declarations: [RegisterComponent, LoginComponent, LogoutComponent, UserListComponent],
  providers: [],
})
export class UsersModule { }
