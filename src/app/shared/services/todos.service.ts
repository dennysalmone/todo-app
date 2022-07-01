import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, Subject } from "rxjs";
import { DeleteTodo, PostTodo, Task, DragAndDropTodo, DeleteTodoList, PostTodoList, PostBoard, DeleteBoard, receivedBoards, changeAccesList, Board, TodoList } from "src/app/types/types";
import { environment } from 'src/environments/environment';

@Injectable()

export class TodosService {

    constructor(private http: HttpClient) {}

    todoCreated$ = new Subject<{name: string}>();
    todoListCreated$ = new Subject<{name: string, desc: string}>();
    boardCreated$ = new Subject<{name: string}>();
    boardAccess$ = new Subject<{access: string[]}>();

    getBoards(): Observable<receivedBoards> {
        return this.http.get<receivedBoards>(`${environment.URL}boards`)
    }

    changeAccessListBoard(data: changeAccesList): Observable<changeAccesList> {
        return this.http.post<changeAccesList>(`${environment.URL}boards-access`, data)
    }

    createBoard(data: PostBoard): Observable<Board> {
        return this.http.post<Board>(`${environment.URL}boards-create`, data)
    }

    createTodoList(data: PostTodoList): Observable<TodoList> {
        return this.http.post<TodoList>(`${environment.URL}todo-list`, data)
    }

    deleteTodoList(data: DeleteTodoList): Observable<DeleteTodoList> {
        return this.http.delete<DeleteTodoList>(`${environment.URL}delete-list`, {body: data})
    }

    deleteBoard(data: DeleteBoard): Observable<DeleteBoard> {
        return this.http.delete<DeleteBoard>(`${environment.URL}delete-board`, {body: data})
    }

    createTodo(data: PostTodo): Observable<Task> {
        return this.http.post<Task>(`${environment.URL}todo`, data)
    }

    changeTodo(data: DragAndDropTodo): Observable<DragAndDropTodo> {
        return this.http.post<DragAndDropTodo>(`${environment.URL}change`, data)
    }

    deleteTodo(data: DeleteTodo): Observable<DeleteTodo> {
        return this.http.delete<DeleteTodo>(`${environment.URL}todo-delete`, {body: data})
    }

}