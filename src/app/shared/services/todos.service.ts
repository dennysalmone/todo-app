import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { TodoList, Task, Board, DeleteTodo, PostTodo, DragAndDropTodo, DeleteTodoList, PostTodoList, PostBoard } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {}

    todoCreated$ = new Subject<{name: string}>();
    todoListCreated$ = new Subject<{name: string, desc: string}>();
    boardCreated$ = new Subject<{name: string}>();


    getBoards(): Observable<Board[]> {
        return this.http.get<Board[]>(`${environment.URL}boards`)
    }

    createBoard(data: PostBoard): Observable<any> {
        return this.http.post<PostBoard>(`${environment.URL}boards-create`, data)
    }

    createTodoList(data: PostTodoList): Observable<any> {
        return this.http.post<PostTodoList>(`${environment.URL}todo-list`, data)
    }

    deleteTodoList(data: DeleteTodoList): Observable<any> {
        return this.http.delete<DeleteTodoList>(`${environment.URL}delete-list`, {body: data})
    }

    createTodo(data: PostTodo): Observable<any> {
        return this.http.post<PostTodo>(`${environment.URL}todo`, data)
    }

    changeTodo(data: DragAndDropTodo): Observable<any> {
        return this.http.post<any>(`${environment.URL}change`, data)
    }

    deleteTodo(data: DeleteTodo): Observable<any> {
        return this.http.delete<DeleteTodo>(`${environment.URL}todo-delete`, {body: data})
    }

}