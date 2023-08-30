import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartsService, CartState } from './carts.service';

const AUTH_API = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

export interface orderItem {
  productId: string,
  quantity: number,
  price: number,
  title: string,
  _id: string
}

export interface customerInfo {
  firstName: string,
  lastName: string,
  email: string,
  tel: string,
  address: string
}

export interface orderInfo {
  userId: string,
  customerInfo: customerInfo,
  createdDate: string,
  status: string,
  items: orderItem[],
  id: string
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) { }

  getAll(page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `orders?page=${page}&limit=${limit}`, httpOptions);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'orders/' + id, httpOptions);
  }

  getByUser(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + 'orders/user/' + id + `?page=${page}&limit=${limit}`, httpOptions);
  }

  add(userId: string, cartId: string, customerId: string): Observable<any> {
    return this.http.post(AUTH_API + 'orders', {
      userId,
      cartId,
      customerId
    }, httpOptions);
  }

  update(userId: string, cartId: string, customerInfo: customerInfo): Observable<any> {
    return this.http.put(AUTH_API + 'orders/' + cartId, {
      userId,
      cartId,
      customerInfo
    }, httpOptions);
  }
}
