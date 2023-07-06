import { NgModule } from '@angular/core';
import { UsersService } from '../_service/users.service';
import { UsersRoutingModule } from './users-routing.module';
import { RegisterComponent } from './register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';




const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule
];

@NgModule({
  imports: [UsersRoutingModule, ReactiveFormsModule, NgIf, ...moduleAngularMaterial],
  exports: [],
  declarations: [RegisterComponent, LoginComponent, LogoutComponent],
  providers: [UsersService],
})
export class UsersModule { }
