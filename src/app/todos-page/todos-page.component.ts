import { Component, OnInit } from '@angular/core';
import { Task, Board, DeleteTodo, PostTodo, DragAndDropTodo, DeleteTodoList, PostTodoList, getBoards } from '../types/types';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'
import { TodosService } from '../shared/services/todos.service';
import { MaterialService } from '../shared/classes/material.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateTodolistModalComponent } from '../create-todolist-modal/create-todolist-modal.component';
import { CreateTodoModalComponent } from '../create-todo-modal/create-todo-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

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
  userEmail: string = '';
  
  constructor(private todoService: TodosService, private dialog: MatDialog, private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => this.selectBoard(params['list']))
  }

  ngOnInit (): void {
    this.getBoards()
  }


  getBoards(): void {
    this.bSub = this.todoService.getBoards().subscribe({
      next: (v: getBoards) => {
        this.boards = v.boards
        this.userEmail = v.email
        this.checkLocalStorage()
        this.checkBoards()
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  checkBoards(): void {
    if(!this.boards.length) {
      this.router.navigate(['/boards'])
    }
  }

  checkLocalStorage(): void {
    this.choisedBoard = Number(localStorage.getItem('Board'));
  }

  postTodoList(data: {name: string, desc: string}): void { // post list
    let boardForCreate = this.boards[this.choisedBoard]
    const newList: PostTodoList = {name: data.name, desc: data.desc, boardId: boardForCreate.id}
    this.aSub = this.todoService.createTodoList(newList).subscribe({
      next: (v) => {
        boardForCreate.lists.push({name: v.name, desc: v.desc, collectionId: v.collectionId, todos: []})
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  deleteTodoList(listIndex: number, boardIndex: number, boardid: number, collId: number): void { // delete list
    let data: DeleteTodoList = { listIndex: listIndex, boardIndex: boardIndex, boardId: boardid, collId: collId }
    this.aSub = this.todoService.deleteTodoList(data).subscribe({
      next: () => {
        this.boards[boardIndex].lists.splice(listIndex, 1);
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  postTodo(name: {title: string}, collId: number, collIndex: number, boardId: number, boardIndex: number): void { // post task
    const data: PostTodo = {title: name.title, collId: collId, boardId: boardId}
    this.aSub = this.todoService.createTodo(data).subscribe({
      next: (v) => {
        const newTask = {id: v.id, title: v.title, status: v.status}
        this.boards[boardIndex].lists[collIndex].todos.push(newTask)
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  deleteTodo(task: Task, collId: number, collIndex: number, boardId: number, boardIndex: number): void { // delete task
    const data: DeleteTodo = {id: task.id, title: task.title, status: task.status, collId: collId, boardId: boardId}
    this.aSub = this.todoService.deleteTodo(data).subscribe({
      next: () => {
        const index = this.boards[boardIndex].lists[collIndex].todos.indexOf(task);
        this.boards[boardIndex].lists[collIndex].todos.splice(index, 1);
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }
  
  postDragAndDrop(data: DragAndDropTodo): void {
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
        this.postTodo(data as any, collId, collIndex, boardId, boardIndex)
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
          this.postTodoList(data as {name: string, desc: string})
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateTodolistModalComponent, dialogConfig)
  }

  selectBoard(index: number): void {
    if(!index) {
      return;
    }
    this.choisedBoard = index;
    localStorage.setItem('Board', String(this.choisedBoard));
  }

  checkSelectedBoard(index: number): boolean {
    return this.choisedBoard === index;
  }

  onDrop(event: CdkDragDrop <Task[]>, collectionId: number): void {
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
    let data: DragAndDropTodo = {
      newListCollectionId: collectionId,
      newTaskIndex: event.currentIndex,
      todo: event.container.data[event.currentIndex],
      boardId: this.boards[this.choisedBoard].id,
    };
    this.postDragAndDrop(data)
  }

}

