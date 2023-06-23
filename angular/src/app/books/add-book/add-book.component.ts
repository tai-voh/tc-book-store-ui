import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';

@Component({
  selector: 'add-book',
  templateUrl: 'add-book.component.html',
  styleUrls: ['add-book.component.scss']
})

export class AddBookComponent implements OnInit {
  public myForm: FormGroup;
  errorMessage = '';
  categories: any[];
  
  constructor(private booksService: BooksService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    var userId = '';
    if (this.tokenStorage.getToken()) {
      userId = this.tokenStorage.getUser().id;
    }
    else {
      this.router.navigate(['/']);
    }
    this.categories = ListCategoriesComponent.getCategoryList();
    this.myForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.maxLength(100)]),
      quantity: new FormControl('', [Validators.required, Validators.min(1)]),
      price: new FormControl('', [Validators.required, Validators.min(1)]),
      description: new FormControl(''),
      categoryId: new FormControl(''),
      userId: new FormControl(userId)
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  onSubmit(): void {
    const { title, quantity, price, description, categoryId, userId } = this.myForm.value;
    this.booksService.add(title, quantity, price, description, categoryId, userId).subscribe({
      next: (data) => {
        MessageToastComponent.showMessage(this._snackBar, 'Created book successfully!');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Created book failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }
}
