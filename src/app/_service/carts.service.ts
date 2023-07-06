import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

const AUTH_API = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

export interface Item {
  productId: string,
  quantity: number
}

export interface reponseItem {
  productId: string,
  title: string,
  quantity: number,
  price: number,
  stockQuantity: number
}

export interface CartState {
  cartId: string,
  userId: string,
  items: reponseItem[]
}

@Injectable({
  providedIn: 'root'
})
export class CartsService {
  constructor(private http: HttpClient) { }

  private cartSubject = new BehaviorSubject<CartState>({cartId: '', userId: '', items: []});
  CartState = this.cartSubject.asObservable();

  getAll(): Observable<any> {
    return this.http.get(AUTH_API + 'carts', httpOptions);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'carts/' + id, httpOptions).pipe(
      tap((res: any) => {
        if (res) {
          const data = res;
          this.cartSubject.next(<CartState>{cartId: data.id, userId: data.userId, items: data.items});
        }
      })
    );
  }

  getOneByUser(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'carts/user/' + id, httpOptions).pipe(
      tap((res: any) => {
        if (res) {
          const data = res;
          this.cartSubject.next(<CartState>{cartId: data.id, userId: data.userId, items: data.items});
        }
      })
    );
  }

  add(userId: string, items: Item | Item[]): Observable<any> {
    return this.http.post(AUTH_API + 'carts', {
      userId,
      items
    }, httpOptions).pipe(
      tap((res: any) => {
        if (res) {
          const data = res;
          this.cartSubject.next(<CartState>{cartId: data.id, userId: data.userId, items: data.items});
        }
      })
    );
  }

  update(cartId: string, userId: string, items: Item | Item[], update: boolean = false): Observable<any> {
    return this.http.put(AUTH_API + 'carts/' + cartId, {
      userId,
      items,
      update
    }, httpOptions).pipe(
      tap((res: any) => {
        if (res) {
          const data = res;
          this.cartSubject.next(<CartState>{cartId: data.id, userId: data.userId, items: data.items});
        }
      })
    );
  }

  erase(): void {
    this.cartSubject.next(<CartState>{cartId: '', userId: '', items: []});
  }
}
