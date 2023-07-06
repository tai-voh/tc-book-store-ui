import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListBooksComponent } from './list-books/list-books.component';
import { HomeBooksComponent } from './home-books/home-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { AuthGuard, AdminAuthGuard } from '../_service/auth.guard.service';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomeBooksComponent, title: 'Books' },
  { path: 'add', pathMatch: 'full', component: AddBookComponent, title: 'Add Book', canActivate: [AdminAuthGuard] },
  { path: 'update/:bookId', pathMatch: 'full', component: AddBookComponent, title: 'Edit Book', canActivate: [AdminAuthGuard] },
  { path: 'detail/:bookId', pathMatch: 'full', component: BookDetailsComponent, title: 'Book Details' },
  { path: 'list', pathMatch: 'full', component: ListBooksComponent, title: 'List Book', canActivate: [AdminAuthGuard] },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule { }
