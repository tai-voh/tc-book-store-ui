import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBooksComponent } from './list-books/list-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookDetailsComponent } from './book-details/book-details.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: ListBooksComponent, title: 'List Book' },
  { path: 'add', pathMatch: 'full', component: AddBookComponent, title: 'Add Book' },
  { path: ':bookId', pathMatch: 'full', component: BookDetailsComponent, title: 'Book Details' },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
