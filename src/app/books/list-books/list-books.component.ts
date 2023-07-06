import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';

@Component({
  selector: 'list-books',
  templateUrl: 'list-books.component.html',
  styleUrls: ['list-books.component.scss']
})

export class ListBooksComponent implements OnInit {
  errorMessage = '';
  books: any[];
  categoryList: any[];
  constructor(private booksService: BooksService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.categoryList = ListCategoriesComponent.getCategoryList();
    this.booksService.getAll().subscribe({
      next: (data) => {
        this.books = data.data;
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get books failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }

  getCategoryName(id: string) {
    return ListCategoriesComponent.getCategoryName(id);
  }

  onDetail(id: string) {
    const path = '/books/' + id;
    this.router.navigate([path]);
  }
}
