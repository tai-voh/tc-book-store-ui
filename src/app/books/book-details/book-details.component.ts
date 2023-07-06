import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import { Item, CartState, CartsService } from '../../_service/carts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router, ActivatedRoute } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';
import { Subscription, combineLatest, Observable, of } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';

@Component({
  selector: 'book-details',
  templateUrl: 'book-details.component.html',
  styleUrls: ['book-details.component.scss']
})

export class BookDetailsComponent implements OnInit {
  errorMessage = '';
  book:any = {};
  bookId = '';
  inputQuantity = new FormControl(1);
  private cartSubscription: Subscription;
  cartId = '';
  userId = '';
  imagePath = '';

  constructor(private booksService: BooksService, private cartsService: CartsService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.activeRoute.paramMap
      .pipe(
        map((params) => {
          return String(params.get('bookId')) || '';
        }),
        filter(bookId => !!bookId),
        switchMap((bookId) => {
          this.bookId = bookId ? bookId : '';
          
          return this.booksService.getOne(this.bookId);
        })
      )
      .subscribe({
          next: (data) => {
            if (data) {
              this.book = data;
              this.book.categoryName = ListCategoriesComponent.getCategoryName(this.book.categoryId);
              if (this.book?.quantity) {
                this.inputQuantity = new FormControl(1, [Validators.required, Validators.min(1), Validators.max(this.book.quantity)]);
              }
              
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Get book failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
        });

    if (this.book?.categoryId) {
      this.book.categoryName = ListCategoriesComponent.getCategoryName(this.book.categoryId);
    }
    this.cartSubscription = this.cartsService.CartState.subscribe((state: CartState) => {
      this.cartId = state.cartId;
    });
    this.userId = this.tokenStorage.getUser()?.id;
    this.imagePath = this.booksService.getImagePath();
  }

  addToCart(id: string) {
    if (!this.userId) {
      MessageToastComponent.showMessage(this._snackBar, 'Please log in before buying');
    }
    else {
      const items: Item[] = [
        {
          productId: id,
          quantity: this.inputQuantity.value || 1
        }
      ];
      if (this.cartId) {
        this.cartsService.update(this.cartId, this.userId, items).subscribe({
          next: (data) => {
            MessageToastComponent.showMessage(this._snackBar, 'Added to cart successfully!');
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Adding to cart failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
        });
      }
      else {
        this.cartsService.add(this.userId, items).subscribe({
          next: (data) => {
            MessageToastComponent.showMessage(this._snackBar, 'Added to cart successfully!');
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Adding to cart failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
        });
      }
    }
  }
}
