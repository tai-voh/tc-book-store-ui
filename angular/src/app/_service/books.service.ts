import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(AUTH_API + 'books', httpOptions);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'books/' + id, httpOptions);
  }

  add(title: string, quantity: number, price: number, description: string, categoryId: string, userId: string): Observable<any> {
    return this.http.post(AUTH_API + 'books', {
      title,
      quantity,
      price,
      description,
      categoryId,
      userId
    }, httpOptions);
  }
}
