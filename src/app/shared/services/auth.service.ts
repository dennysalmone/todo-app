import { Injectable, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { User } from "src/app/types/interfaces";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()

export class AuthService {
    private token = ''
    constructor(private http: HttpClient, private router: Router) {

    }

    register(user: User): Observable<User> {
        return this.http.post<User>(`http://localhost:3000/register`, user)
    }

    login(user: User): Observable<{token: string}> {
        return this.http.post<{token: string}>(`http://localhost:3000/login`, user)
        .pipe(
            tap(
                ({token}) => {
                    localStorage.setItem('authToken', token)
                    this.setToken(token)
                    this.setTokenFromLocalStorage()
                }
            )
        )
    }

    setToken (token: string) {
        this.token = token
    }

    getToken(): string {
        return this.token;
    }

    setTokenFromLocalStorage() {
        if (localStorage.getItem('authToken')) {
            this.token = (localStorage.getItem('authToken') as string);
        }
        console.log('setTokenFromLocalStorage')
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    logout() {
        this.setToken('');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login'])
    }
}