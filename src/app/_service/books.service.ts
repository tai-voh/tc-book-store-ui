import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const AUTH_API = environment.apiUrl;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' })
};

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient) { }

  getAll(page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `books?page=${page}&limit=${limit}`, httpOptions);
  }

  getBySearchKey(searchKey: string, page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `books?page=${page}&limit=${limit}&search=${searchKey}`, httpOptions);
  }

  getByUser(userId:string, page: number, limit: number): Observable<any> {
    return this.http.get(AUTH_API + `books/user?userId=${userId}page=${page}&limit=${limit}`, httpOptions);
  }

  getOne(id: string): Observable<any> {
    return this.http.get(AUTH_API + 'books/' + id, httpOptions);
  }

  oldAdd(title: string, quantity: number, price: number, description: string, file: File, categoryId: string, userId: string): Observable<any> {
    return this.http.post(AUTH_API + 'books', {
      title,
      quantity,
      price,
      description,
      file,
      categoryId,
      userId
    }, httpOptions);
  }

  oldDelete(id: string): Observable<any> {
    return this.http.delete(AUTH_API + 'books/' + id, httpOptions);
  }

  oldAddWithImage(formData: FormData): Observable<any> {
    return this.http.post(AUTH_API + 'books', formData);
  }

  oldUpdateWithImage(id: string, formData: FormData): Observable<any> {
    return this.http.put(AUTH_API + 'books/' + id, formData);
  }

  addWithImage(formData: FormData): Observable<any> {
    formData.append('action', 'create');
    formData.append('id', '');
    return this.http.post(AUTH_API + 'books/request', formData);
  }

  updateWithImage(id: string, formData: FormData): Observable<any> {
    formData.append('action', 'update');
    formData.append('id', id);
    return this.http.post(AUTH_API + 'books/request', formData);
  }

  delete(id: string): Observable<any> {
    const formData = new FormData();
    formData.append('action', 'deleteByBookId');
    formData.append('id', id);
    return this.http.post(AUTH_API + 'books/request', formData);
  }

  getImagePath() {
    return environment.imageUrl;
  }
}
