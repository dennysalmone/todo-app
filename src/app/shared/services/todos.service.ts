import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { DeleteTodo, PostTodo, DragAndDropTodo, DeleteTodoList, PostTodoList, PostBoard, DeleteBoard, getBoards, changeAccesList } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {}

    todoCreated$ = new Subject<{name: string}>();
    todoListCreated$ = new Subject<{name: string, desc: string}>();
    boardCreated$ = new Subject<{name: string}>();
    boardAcces$ = new Subject<{access: string[]}>();

    getBoards(): Observable<getBoards> {
        return this.http.get<getBoards>(`${environment.URL}boards`)
    }

    changeAccessListBoard(data: changeAccesList): Observable<any> {
        return this.http.post<changeAccesList>(`${environment.URL}boards-access`, data)
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

    deleteBoard(data: DeleteBoard): Observable<any> {
        return this.http.delete<DeleteBoard>(`${environment.URL}delete-board`, {body: data})
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