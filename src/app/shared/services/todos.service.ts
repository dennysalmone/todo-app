import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { collection, task } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {

    }

    newTodo$ = new Subject()
    newTodoList$ = new Subject()

    getTodos(): Observable<any> {
        return this.http.get<collection>(`${environment.URL}todo`)
    }

    postTodoList(data: collection): Observable<any> {
        return this.http.post<collection>(`${environment.URL}todo-list`, data)
    }

    deleteTodoList(data: collection): Observable<any> {
        return this.http.delete<collection>(`${environment.URL}todo-list`, {body: data})
    }

    postTodo(data: object): Observable<any> {
        return this.http.post<task>(`${environment.URL}todo`, data)
    }

    changeTodo(data: {}): Observable<any> {
        return this.http.post<task>(`${environment.URL}change`, data)
    }

    deleteTodo(data: task): Observable<any> {
        return this.http.delete<task>(`${environment.URL}todo-delete`, {body: data})
    }

}