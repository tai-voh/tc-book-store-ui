import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from '../../_service/token-storage.service';
import { BooksService } from '../../_service/books.service';
import { Item, CartState, CartsService } from '../../_service/carts.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { Router } from '@angular/router';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';
import { Subscription, fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, map } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'home-books',
  templateUrl: 'home-books.component.html',
  styleUrls: ['home-books.component.scss']
})

export class HomeBooksComponent implements OnInit {
  errorMessage = '';
  books: any[];
  categoryList: any[];
  private cartSubscription: Subscription;
  cartId = '';
  userId = '';
  imagePath = '';
  pageEvent: PageEvent;
  length = 0;
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions = [3,5,10];

  @ViewChild('searchInput', {static: true}) searchInput!: ElementRef

  constructor(private booksService: BooksService, private cartsService: CartsService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.categoryList = ListCategoriesComponent.getCategoryList();
    this.booksService.getAll(this.pageIndex + 1, this.pageSize).subscribe({
      next: (data) => {
        this.books = data.data;
        this.length = data.total;
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get books failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
    this.cartSubscription = this.cartsService.CartState.subscribe((state: CartState) => {
      this.cartId = state.cartId;
    });
    this.userId = this.tokenStorage.getUser()?.id;
    this.imagePath = this.booksService.getImagePath();

    fromEvent(this.searchInput.nativeElement, 'keyup')
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        filter(searchTerm => searchTerm.length > 2),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(searchKey => this.booksService.getBySearchKey(searchKey.toString(), 0, this.pageSize))
      )
      .subscribe({
        next: (data) => {
          this.books = data.data;
          this.length = data.total;
          this.pageIndex = 0;
          console.log(this.length);
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
    const path = '/books/detail/' + id;
    this.router.navigate([path]);
  }

  addToCart(id: string) {
    if (!this.userId) {
      MessageToastComponent.showMessage(this._snackBar, 'Please log in before buying');
    }
    else {
      const items: Item[] = [
        {
          productId: id,
          quantity: 1
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

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.booksService.getAll(this.pageIndex + 1, this.pageSize).subscribe({
      next: (data) => {
        this.books = data.data;
        this.length = data.total;
      },
      error: (err) => {
        this.errorMessage = err.error.message ? err.error.message : 'Get books failed!';
        MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
      }
    });
  }

  ngOnDestroy() {
    this.cartSubscription.unsubscribe();
  }
}
