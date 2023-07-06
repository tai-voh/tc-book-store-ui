import { NgModule } from '@angular/core';
import { BooksService } from '../_service/books.service';
import { BooksRoutingModule } from './books-routing.module';
import { ListBooksComponent } from './list-books/list-books.component';
import { HomeBooksComponent } from './home-books/home-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';{}
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { CurrencyPipe, CommonModule } from '@angular/common';


const moduleAngularMaterial = [
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatIconModule,
  MatButtonModule,
  MatSelectModule,
  MatGridListModule,
  MatToolbarModule,
  MatPaginatorModule,
  MatTableModule,
  MatDialogModule
];

@NgModule({
  imports: [BooksRoutingModule, ReactiveFormsModule, NgIf, NgFor, CommonModule, CurrencyPipe, ...moduleAngularMaterial],
  exports: [],
  declarations: [HomeBooksComponent, ListBooksComponent, AddBookComponent, BookDetailsComponent],
  providers: [BooksService],
})
export class BooksModule { }
