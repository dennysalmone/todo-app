import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { TodoList, Task, Board } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {}

    todoCreated$ = new Subject();
    todoListCreated$ = new Subject();
    boardCreated$ = new Subject();

    getTodos(): Observable<any> {
        return this.http.get<any>(`${environment.URL}boards`)
    }

    getBoards(): Observable<any> {
        return this.http.get<any>(`${environment.URL}special-boards`)
    }

    createTodoList(data: any): Observable<any> {
        return this.http.post<any>(`${environment.URL}todo-list`, data)
    }

    createBoard(data: any): Observable<any> {
        return this.http.post<any>(`${environment.URL}boards-create`, data)
    }

    deleteTodoList(data: any): Observable<any> {
        return this.http.delete<any>(`${environment.URL}delete-list`, {body: data})
    }

    createTodo(data: any): Observable<any> {
        return this.http.post<any>(`${environment.URL}todo`, data)
    }

    changeTodo(data: any): Observable<any> {
        return this.http.post<any>(`${environment.URL}change`, data)
    }

    deleteTodo(data: any): Observable<any> {
        return this.http.delete<any>(`${environment.URL}todo-delete`, {body: data})
    }

}