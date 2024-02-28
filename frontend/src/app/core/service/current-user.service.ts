import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private baseUrl: string = 'http://localhost:8000/user';
  private currentUser: any;
  private tokenKey: string = 'currentUserAccessToken';
  private token: string | null = null;

  constructor() {
    // Retrieve token from local storage on service initialization
    this.token = localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
    console.log('token from backedn : ' + token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
  }

  getCurrentUser(): any {
    return this.currentUser;
  }

  setCurrentUser(user: any): void {
    this.currentUser = user;
    console.log('from current user : ', this.currentUser);
  }
}
