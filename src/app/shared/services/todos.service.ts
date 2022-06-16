import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { TodoList, Task } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {

    }

    todoCreated$ = new Subject()
    todoListCreated$ = new Subject()

    getTodos(): Observable<any> {
        return this.http.get<TodoList>(`${environment.URL}todo`)
    }

    createTodoList(data: TodoList): Observable<any> {
        return this.http.post<TodoList>(`${environment.URL}todo-list`, data)
    }

    deleteTodoList(data: TodoList): Observable<any> {
        return this.http.delete<TodoList>(`${environment.URL}todo-list`, {body: data})
    }

    createTodo(data: object): Observable<any> {
        return this.http.post<Task>(`${environment.URL}todo`, data)
    }

    changeTodo(data: {}): Observable<any> {
        return this.http.post<Task>(`${environment.URL}change`, data)
    }

    deleteTodo(data: Task): Observable<any> {
        return this.http.delete<Task>(`${environment.URL}todo-delete`, {body: data})
    }

}