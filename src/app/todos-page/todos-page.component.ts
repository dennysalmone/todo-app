import { Component, OnDestroy, OnInit } from '@angular/core';
import { collection, task } from '../types/types';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'
import { TodosService } from '../shared/services/todos.service';
import { MaterialService } from '../shared/classes/material.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateTodolistModalComponent } from '../create-todolist-modal/create-todolist-modal.component';
import { CreateTodoModalComponent } from '../create-todo-modal/create-todo-modal.component';

@Component({
  selector: 'app-todos-page',
  templateUrl: './todos-page.component.html',
  styleUrls: ['./todos-page.component.scss']
})

export class TodosPageComponent implements OnInit {
  aSub: any;
  dialogSub: any;
  dialogTodoSub: any;
  title = 'angular-todo-frontend'; 
  data: any = 'placeholder';
  newTodotask: any = '';
  URL: string = `${environment.URL}todo`;
  collection: collection[] = [];
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

  serverPostCollection(data: collection) {
    this.aSub = this.todoService.postTodoList(data).subscribe({
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverDeleteCollection(data: collection) {
    this.aSub = this.todoService.deleteTodoList(data).subscribe({
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestPost(data: task, collId: object) {
    var obj = Object.assign(data, collId);
    this.aSub = this.todoService.postTodo(obj).subscribe({
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  serverRequestDelete(data: task) {
    this.aSub = this.todoService.deleteTodo(data).subscribe({
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }
  
  serverRequestDragDrop(data: {}) {
    this.aSub = this.todoService.changeTodo(data).subscribe({
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  foundFreeIndex(): number {
    let allTasks = this.unboxedCollection()
    let arrayOfIndexes: Number[] = []
    for (let i=0; i<allTasks.length; i++) {
      arrayOfIndexes.push(allTasks[i].id)
    }
    for (let j=0; j<(allTasks.length+5); j++) {
      if (!arrayOfIndexes.includes(j)) {
        return j;
      }
    }
    return allTasks.length+1 
  }

  deleteTask(todo: task, i: number): void {
    console.log('удалил тудушку с тексом ', todo?.title);
    this.serverRequestDelete(todo)
    var index = this.collection[i].todos.indexOf(todo);
    this.collection[i].todos.splice(index, 1);

  }

  unboxedCollection(): task[] {
    let array: task[] = [];
    for (let i=0; i<this.collection.length; i++) {
      array = array.concat(this.collection[i].todos)
    };
    return array;
  }

  deleteCollection(index: number): void {
    this.serverDeleteCollection(this.collection[index])
    this.collection.splice(index, 1);
  }

  openDialogTodo(collId: number, index: number): void {
    this.dialogTodoSub = this.todoService.newTodo$.subscribe(
      (data) => {
        this.dialogTodoSub.unsubscribe()
        this.createNewTodo(collId, index, data)
      }
  )
  const dialogConfig = new MatDialogConfig();
  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  this.dialog.open(CreateTodoModalComponent, dialogConfig)
  }

  openDialogList(): void {
    this.dialogSub = this.todoService.newTodoList$.subscribe(
        (data) => {
          this.dialogSub.unsubscribe()
          this.createCollection(data)
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateTodolistModalComponent, dialogConfig)
  }

  createCollection(data: any): void {
    let freeIndex = this.foundFreeIndexForCollection()
    let newCollection = {name: data.name, desc: data.desc, collectionId: freeIndex, todos: []}
    this.collection.push(newCollection)
    this.serverPostCollection(newCollection)
  }

  foundFreeIndexForCollection(): number {
    let arrayOfIndexes: any[] = []
    for (let i=0; i<this.collection.length; i++) {
      arrayOfIndexes.push(this.collection[i]?.collectionId)
    }
    for (let j=0; j<(this.collection.length+5); j++) {
      if (!arrayOfIndexes.includes(j)) {
        return j;
      }
    }
    return this.collection.length+1 
  }

  onDrop(event: CdkDragDrop <task[]>, collectionId: number) {
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

  createNewTodo(collId: number, index: number, data: any): void {
    if (data.title && this.collection.length > 0) {
      console.log(`добавил тудушку с текстом ${data.title}`)
      let newTask = {id:this.foundFreeIndex(), title: data.title, status: true}
      this.serverRequestPost(newTask, {collId: collId})
      this.collection[index].todos.push(newTask)
    }
    this.newTodotask = ''
  }
}

