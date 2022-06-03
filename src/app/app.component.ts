import { Component } from '@angular/core';
import { collection, task } from './types/types';
import { CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-frontend'; 
  data: any = 'placeholder';
  newTodotask: string = '';
  URL: string = `http://localhost:3000/todo`;
  URLlist: string = `http://localhost:3000/todo-list`;
  URLChange: string = `http://localhost:3000/change`
  collection: collection[] = [{
    name: 'test',
    collectionId: 0,
    todos: [
      {id:0, title: "00000", status: true},
      {id:1, title: "11111", status: true},
      {id:2, title: "22222", status: true}
    ]
  }];

  ngOnInit (): void {
    this.serverRequestGet(this.URL)
  }

  serverRequestGet(URL: string): void {
    fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.collection = data
      console.log(`гет отработал и передал нам ${data}`)
    });
  }

  async serverRequestPost(URL: string, data: task): Promise<any> {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }

  // async serverRequestPut(URL: string, data: task): Promise<any> {
  //   const response = await fetch(URL, {
  //     method: 'PUT',
  //     body: JSON.stringify(data),
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   return await response.json();
  // }

  async serverPostCollection(URL: string, data: collection): Promise<any> {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }

  async serverDeleteCollection(URL: string, data: collection): Promise<any> {
    const response = await fetch(URL, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }

  async serverRequestDragDrop(URL: string, indexes: {}): Promise<any> {
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify(indexes),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
  }
  
  async serverRequestDelete(URL: string, data: task): Promise<any> {
    const response = await fetch(URL, {
      method: 'DELETE',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return await response.json();
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
    this.serverRequestDelete(this.URL, todo)
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
    this.serverDeleteCollection(this.URLlist, this.collection[index])
    this.collection.splice(index, 1);
  }

  checkListForDelete(list: collection): boolean {
    if (list.todos.length > 0) {
      return false;
    }
    return true;
  }

  createCollection(): void {
    let freeIndex = this.foundFreeIndexForCollection()
    let newCollection = {name: `Collection ${freeIndex}`, collectionId: freeIndex, todos: []}
    this.collection.push(newCollection)
    this.serverPostCollection(this.URLlist, newCollection)
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
    console.log(event)
    // let oldCollectionId = function (context: any) {
    //   for (let i=0; i<context.collection.length; i++) {
    //     if (context.collection[i].todos == event.container.data) {
    //       return context.collection[i].collectionId
    //     }
    //   }
    // }

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

    console.log(indexes)
    this.serverRequestDragDrop(this.URLChange, indexes)
  }

  createNewTodo(value: string): void {
    if (value.split(' ').join('') && this.collection.length > 0) {
      console.log(`добавил тудушку с текстом ${value}`)
      let newTask = {id:this.foundFreeIndex(), title: value, status: true}
      this.serverRequestPost(this.URL, newTask)
      this.collection[0].todos.push(newTask)
    }
    this.newTodotask = ''
  }
}

