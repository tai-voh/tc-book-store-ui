import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';

@Component({
  selector: 'book-details',
  templateUrl: 'book-details.component.html',
  styleUrls: ['book-details.component.scss']
})

export class BookDetailsComponent implements OnInit {
  errorMessage = '';
  book:any = {};
  bookId = '';
  categoryList: any[];

  constructor(private booksService: BooksService, private _snackBar: MatSnackBar, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.categoryList = ListCategoriesComponent.getCategoryList();
    let bookId = this.activeRoute.snapshot.paramMap.get('bookId');
    this.bookId = bookId ? bookId : '';
    this.booksService.getOne(this.bookId).subscribe({
      next: (data) => {
        if (data) {
          this.book = data;
          this.book.categoryName = ListCategoriesComponent.getCategoryName(this.book.categoryId);
        }
        
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get book failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }
}
