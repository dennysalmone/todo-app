import { Component, OnDestroy, OnInit } from '@angular/core';
import { TodoList, Task } from '../types/types';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'
import { TodosService } from '../shared/services/todos.service';
import { MaterialService } from '../shared/classes/material.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateTodolistModalComponent } from '../create-todolist-modal/create-todolist-modal.component';
import { CreateTodoModalComponent } from '../create-todo-modal/create-todo-modal.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss']
})

export class TodosPageComponent implements OnInit {
  aSub!: Subscription;
  dialogSub!: Subscription;
  dialogTodoSub!: Subscription;
  title = 'angular-todo-frontend'; 
  newTodotask: string = '';
  URL: string = `${environment.URL}todo`;
  collection: TodoList[] = [];
  constructor(private todoService: TodosService, private dialog: MatDialog) {

  }

  ngOnInit (): void {
    this.serverRequestGet()
  }

  serverRequestGet() {
    this.aSub = this.todoService.getTodos().subscribe({
      next: (v) => {this.collection = v},
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverPostTodoList(data: object) { // post list
    let list = (data as any)
    const newCollection = {name: list.name, desc: list.desc, collectionId: 0, todos: []}
    this.aSub = this.todoService.createTodoList(newCollection).subscribe({
      next: (v) => {
        this.collection.push({name: v.name, desc: v.desc, collectionId: v.collectionId, todos: []})
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverDeleteCollection(index: number) { // delete list
    let data = (this.collection[index])
    this.aSub = this.todoService.deleteTodoList(data).subscribe({
      next: () => {
        this.collection.splice(index, 1);
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestPost(task: object, collId: number, index: number) { // post task
    const arr = [task, collId]
    this.aSub = this.todoService.createTodo(arr).subscribe({
      next: (v) => {
        const newTask = {id: v.id, title: v.title, status: v.status}
        this.collection[index].todos.push(newTask)
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestDelete(task: Task, i: number) { // delete task
    this.aSub = this.todoService.deleteTodo(task).subscribe({
      next: () => {
        const index = this.collection[i].todos.indexOf(task);
        this.collection[i].todos.splice(index, 1);
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

  openTodoDialog(collId: number, index: number): void {
    this.dialogTodoSub = this.todoService.todoCreated$.subscribe(
      (data) => {
        this.dialogTodoSub.unsubscribe()
        let task = (data as object)
        this.serverRequestPost(task, collId, index)
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


  // createNewTodo(collId: number, index: number, data: Task): void {
  //   if (data.title && this.collection.length) {
  //     console.log(`добавил тудушку с текстом ${data.title}`)
  //     const newTask = {id:123456789, title: data.title, status: true}
  //     this.serverRequestPost(newTask, collId)
  //     this.collection[index].todos.push(newTask)
  //   }
  //   this.newTodotask = ''
  // }

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

    let indexes = {
      newListCollectionId: collectionId,
      newTaskIndex: event.currentIndex,
      todo: event.container.data[event.currentIndex]
    };

    this.serverRequestDragDrop(indexes)
  }

}

