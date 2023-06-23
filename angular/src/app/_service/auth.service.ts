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
export class AuthService {
  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(AUTH_API + 'users/login', {
      email,
      password
    }, httpOptions);
  }

  register(firstName: string, lastName: string, email: string, password: string, admin: Boolean): Observable<any> {
    return this.http.post(AUTH_API + 'users', {
      firstName,
      lastName,
      email,
      password,
      admin
    }, httpOptions);
  }
}