import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoList, Task, Board } from '../types/types';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'
import { TodosService } from '../shared/services/todos.service';
import { MaterialService } from '../shared/classes/material.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateTodolistModalComponent } from '../create-todolist-modal/create-todolist-modal.component';
import { CreateTodoModalComponent } from '../create-todo-modal/create-todo-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss']
})

export class TodosPageComponent implements OnInit {
  aSub!: Subscription;
  bSub!: Subscription;
  dialogSub!: Subscription;
  dialogTodoSub!: Subscription;
  dialogBoardSub!: Subscription;
  newTodotask: string = '';
  choisedBoard: number = 0;
  URL: string = `${environment.URL}todo`;
  boards: Board[] = []
  
  constructor(private todoService: TodosService, private dialog: MatDialog) {

  }

  ngOnInit (): void {
    this.serverBoardsGet()
  }


  serverBoardsGet() {
    this.bSub = this.todoService.getBoards().subscribe({
      next: (v) => {this.boards = v},
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverPostTodoList(data: object) { // post list
    let list = (data as any)
    let boardForCreate = this.boards[this.choisedBoard]
    const newTodoList = [{name: list.name, desc: list.desc, collectionId: 0, todos: []}, {boardId: boardForCreate.id}]
    this.aSub = this.todoService.createTodoList(newTodoList).subscribe({
      next: (v) => {
        boardForCreate.lists.push({name: v.name, desc: v.desc, collectionId: v.collectionId, todos: []})
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverPostBoard(data: object) { // post board
    let board = (data as any)
    const newBoard = {name: board.name, id: 0, author: '', acess: '', lists: []}
    this.aSub = this.todoService.createBoard(newBoard as any).subscribe({
      next: (v) => {
        this.boards.push(v)
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverDeleteCollection(index: number, b: number, boardid: number) { // delete list
    let data = [this.boards[b].lists[index], {boardid: boardid}]
    this.aSub = this.todoService.deleteTodoList(data).subscribe({
      next: () => {
        this.boards[b].lists.splice(index, 1);
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestPost(task: object, collId: number, collIndex: number, boardId: number, boardIndex: number) { // post task

    const arr = [task, {collId: collId}, {boardId: boardId}]
    this.aSub = this.todoService.createTodo(arr).subscribe({
      next: (v) => {
        const newTask = {id: v.id, title: v.title, status: v.status}
        this.boards[boardIndex].lists[collIndex].todos.push(newTask)
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestDelete(task: Task, collId: number, collIndex: number, boardId: number, boardIndex: number) { // delete task
    const arr = [{task: task}, {collId: collId}, {boardId: boardId}]
    this.aSub = this.todoService.deleteTodo(arr).subscribe({
      next: () => {
        const index = this.boards[boardIndex].lists[collIndex].todos.indexOf(task);
        this.boards[boardIndex].lists[collIndex].todos.splice(index, 1);
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }
  
  serverRequestDragDrop(data: {}) {
    this.aSub = this.todoService.changeTodo(data).subscribe({
      next: (v) => {},
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  openTodoDialog(collId: number, collIndex: number, boardId: number, boardIndex: number): void {
    this.dialogTodoSub = this.todoService.todoCreated$.subscribe(
      (data) => {
        this.dialogTodoSub.unsubscribe()
        let task = (data as object)
        this.serverRequestPost(task, collId, collIndex, boardId, boardIndex)
      }
  )
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  this.dialog.open(CreateTodoModalComponent, dialogConfig)
  }

  openListDialog(): void {
    this.dialogSub = this.todoService.todoListCreated$.subscribe(
        (data) => {
          this.dialogSub.unsubscribe()
          this.serverPostTodoList(data as object)
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateTodolistModalComponent, dialogConfig)
  }

  openBoardDialog (): void {
    this.dialogBoardSub = this.todoService.boardCreated$.subscribe(
        (data) => {
          this.dialogBoardSub.unsubscribe()
          this.serverPostBoard(data as object)
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateBoardModalComponent, dialogConfig)
  }

  selectBoard(index: number) {
    this.choisedBoard = index;
  }

  checkSelectedBoard(index: number) {
    return this.choisedBoard === index;
  }

  currentBoardCheck(index: number) {
    if(this.choisedBoard === index) {
      return true;
    }
    return false;
  }

  onDrop(event: CdkDragDrop <Task[]>, collectionId: number) {
    if(event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
    let data = {
      newListCollectionId: collectionId,
      newTaskIndex: event.currentIndex,
      todo: event.container.data[event.currentIndex],
      boardId: this.boards[this.choisedBoard].id,
    };
    this.serverRequestDragDrop(data)
  }

}

