import { NgModule } from '@angular/core';
import { BooksService } from '../_service/books.service';
import { BooksRoutingModule } from './books-routing.module';
import { ListBooksComponent } from './list-books/list-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import {NgIf} from '@angular/common';
import { NgFor } from '@angular/common';{}
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatGridListModule} from '@angular/material/grid-list';
import { CurrencyPipe } from '@angular/common';


const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatGridListModule
];

@NgModule({
  imports: [BooksRoutingModule, ReactiveFormsModule, NgIf, NgFor, CurrencyPipe, ...moduleAngularMaterial],
  exports: [],
  declarations: [ListBooksComponent, AddBookComponent, BookDetailsComponent],
  providers: [BooksService],
})
export class BooksModule { }
