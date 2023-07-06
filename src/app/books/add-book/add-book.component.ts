import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';

@Component({
  selector: 'add-book',
  templateUrl: 'add-book.component.html',
  styleUrls: ['add-book.component.scss']
})

export class AddBookComponent implements OnInit {
  public myForm: FormGroup;
  userId = '';
  bookId = '';
  book:any = {};
  errorMessage = '';
  categories: any[];
  myFile: File;
  
  constructor(private booksService: BooksService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private router: Router, private activeRoute: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.tokenStorage.getUser().id;
    this.categories = ListCategoriesComponent.getCategoryList();
    this.bookId = this.activeRoute.snapshot.paramMap.get('bookId') || '';
    this.setForm();
    if (this.bookId) {
      this.booksService.getOne(this.bookId).subscribe({
        next: (data) => {
          if (data) {
            this.book = data;
            this.setForm();
          }
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Get book failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      })
    }
  }

  setForm() : void {
    this.myForm = new FormGroup({
      title: new FormControl(this.book?.title || '', [Validators.required, Validators.maxLength(100)]),
      quantity: new FormControl(this.book?.quantity || '', [Validators.required, Validators.min(1)]),
      price: new FormControl(this.book?.price || '', [Validators.required, Validators.min(1)]),
      file: new FormControl('', this.book?.image ? []: [Validators.required]),
      description: new FormControl(this.book?.description || ''),
      categoryId: new FormControl(this.book?.categoryId || '', [Validators.required]),
      userId: new FormControl(this.userId)
    });
  }

  public myError = (controlName: string, errorName: string) =>{
    return this.myForm.controls[controlName].hasError(errorName);
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.myFile = event.target.files[0];
      if (this.book?.image) this.book.image = '';
    }
  }

  onSubmit(): void {
    const { title, quantity, price, description, file, categoryId, userId } = this.myForm.value;
    const formData: FormData = new FormData();
    const fields = this.myForm.controls;
    Object.keys(fields).forEach(key => {
      formData.append(key, fields[key].value);
    });
    if (this.myFile) {
      formData.append('file', this.myFile);
    }
    else {
      formData.delete('file');
    }

    if (this.bookId) {
      this.booksService.updateWithImage(this.bookId, formData).subscribe({
        next: (data) => {
          MessageToastComponent.showMessage(this._snackBar, 'Updated book successfully!');
          setTimeout(() => {
            this.ngOnInit();
          }, 500);
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Updated book failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      });
    }
    else {
      this.booksService.addWithImage(formData).subscribe({
        next: (data) => {
          MessageToastComponent.showMessage(this._snackBar, 'Created book successfully!');
          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        error: (err) => {
          this.errorMessage = err.error.message ? err.error.message : 'Created book failed!';
          MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
        }
      });
    }
  }
}
