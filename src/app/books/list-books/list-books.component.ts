import { Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { BooksService } from '../../_service/books.service';
import { TokenStorageService } from '../../_service/token-storage.service';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageToastComponent } from '../../utilities/message-toast/message-toast.component';
import { ConfirmDialogComponent } from '../../utilities/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ListCategoriesComponent } from '../../categories/list-categories/list-categories.component';

@Component({
  selector: 'list-books',
  templateUrl: './list-books.component.html',
  styleUrls: ['./list-books.component.scss']
})
export class ListBooksComponent {
  displayedColumns: string[] = ['no', 'image', 'title', 'quantity', 'price', 'category', 'update', 'remove'];
  dataSource: any[];
  userId = '';
  errorMessage = '';
  length = 0;
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  pageEvent: PageEvent;
  imagePath = '';

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private booksService: BooksService, private tokenStorage: TokenStorageService, private _snackBar: MatSnackBar, private dialog: MatDialog ) {}

  ngOnInit() {
    if (this.tokenStorage.getUser().admin) {
      this.userId = this.tokenStorage.getUser().id;
      this.imagePath = this.booksService.getImagePath();
      this.loadItems();
    }
  }

  loadItems(): void {
    this.booksService.getAll(this.pageIndex + 1, this.pageSize)
        .subscribe({
          next: (data) => {
            if (data && data.data?.length) {
              this.dataSource = data.data.map(
                (e:any, index: number) => ({
                  ...e,
                  no: this.pageIndex * this.pageSize + index + 1,
                  image: this.imagePath + e.image || '',
                  categoryName: ListCategoriesComponent.getCategoryName(e.categoryId)
                })
                );
              this.length = data.total;
            }
            else {
              this.length = 0;
            }
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Get books failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadItems();
  }

  onDelete(e:any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete book',
        message: `Would you like to delete the book <strong>${e.title}</strong>?`,
        id: e.id
      },
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      const id = result;
      if (id) {
        this.booksService.delete(id).subscribe({
          next: (data) => {
            if (this.dataSource.length == 1) this.pageIndex--;
            this.loadItems();
          },
          error: (err) => {
            this.errorMessage = err.error.message ? err.error.message : 'Delete book failed!';
            MessageToastComponent.showMessage(this._snackBar, this.errorMessage);
          }
        });
      }
    });
  }
}