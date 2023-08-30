import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { CartsService, CartState } from './carts.service';

const AUTH_API = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

export interface customerInfo {
  id: string,
  firstName: string,
  lastName: string,
  email: string,
  tel: string,
  address: string
}

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  constructor(private http: HttpClient) { }

  getAll(page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `customers?page=${page}&limit=${limit}`, httpOptions);
  }

  getByUser(id: string, page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `customers/user/${id}?page=${page}&limit=${limit}`, httpOptions);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'customers/' + id, httpOptions);
  }

  add(firstName: string, lastName: string, email: string, tel: string, address: string, userId: string): Observable<any> {
    return this.http.post(AUTH_API + 'customers', {
      firstName,
      lastName,
      email,
      tel,
      address,
      userId
    }, httpOptions);
  }

  update(id: string, firstName: string, lastName: string, email: string, tel: string, address: string): Observable<any> {
    return this.http.put(AUTH_API + 'customers/' + id, {
      firstName,
      lastName,
      email,
      tel,
      address
    }, httpOptions);
  }

  delete(id: string): Observable<any> {
    return this.http.delete(AUTH_API + 'customers/' + id, httpOptions);
  }
}
