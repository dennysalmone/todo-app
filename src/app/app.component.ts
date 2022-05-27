import { Component } from '@angular/core';
import { collection, task, taskObj } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-frontend';
  data: any = 'placeholder';
  newTodotask: string = '';
  collection: collection[] = [{collectionId:0}, {collectionId:1}, {collectionId:2}, {collectionId:3}];
  URL: string = `http://localhost:3000/todo`
  tempArrayOfTodos: task[] = [
    {id:0, title: "я писить в контейнере 0", status: true, collection: 0},
    {id:1, title: "а я жеват в контейнере 3", status: false, collection: 3},
    {id:2, title: "а я какуть в контейнере 5", status: false, collection: 5},
  ];

  ngOnInit (): void {
    this.serverRequestGet(this.URL)
  }

  serverRequestGet(URL: string): void {
    fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.tempArrayOfTodos = data
      this.collectionsSetOnLoad()
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

  async serverRequestPut(URL: string, data: task): Promise<any> {
    const response = await fetch(URL, {
      method: 'PUT',
      body: JSON.stringify(data),
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

  toggleStyleCheck(todo: task): Object {
    if(todo?.status) {
      return {'color': 'black'}
    } else {
      return {'text-decoration' : 'line-through', 'color': 'green', 'opacity': '0.25'}
    }
  }

  foundFreeIndex(tempArrayOfTodos: task[]): number {
    let arrayOfIndexes: any[] = []
    for (let i=0; i<tempArrayOfTodos.length; i++) {
      arrayOfIndexes.push(tempArrayOfTodos[i]?.id)
    }
    for (let j=0; j<(tempArrayOfTodos.length+5); j++) {
      if (!arrayOfIndexes.includes(j)) {
        return j;
      }
    }
    return tempArrayOfTodos.length+1 
  }

  deleteTask(todo: task): void {
    console.log('удалил тудушку с тексом ', todo?.title);
    var index = this.tempArrayOfTodos.indexOf(todo);
    this.tempArrayOfTodos.splice(index, 1);     
    this.serverRequestDelete(this.URL, todo)
  }

  toggleStatus(todo: task): void {
    console.log(`переключил статус тудушки ${todo?.title} на ${!(todo?.status)}`);
    (todo as taskObj).status = !(todo as taskObj).status;
    this.serverRequestPut(this.URL, todo)
  }

  checkListId(todo: task, cont: collection): boolean {
    if (todo?.collection == cont.collectionId) {
      return true
    } else {
      return false
    }
  }

  createCollection(): void {
    let freeIndex = this.foundFreeIndexForCollection()
    this.collection.push({collectionId: freeIndex})
  }

  collectionsSetOnLoad(): void {
    let todosCollectionIndexes = [];
    for (let i=0; i<this.tempArrayOfTodos.length; i++) {
      todosCollectionIndexes.push(this.tempArrayOfTodos[i]?.collection)
    }
    let arrayUniqIndexes = (Array.from(new Set(todosCollectionIndexes))).sort() // .sort???? 
    this.collection = []
    for (let j=0; j<arrayUniqIndexes.length; j++) {
      this.collection.push({collectionId: arrayUniqIndexes[j]})
    }
  }

  foundFreeIndexForCollection(): number {
    let arrayOfIndexes: any[] = []
    for (let i=0; i<this.collection.length; i++) {
      arrayOfIndexes.push(this.collection[i]?.collectionId)
    }
    for (let j=0; j<(this.collection.length+5); j++) {
      if (!arrayOfIndexes.includes(j)) {
        console.log(j)
        return j;
      }
    }
    return this.collection.length+1 
  }

  createNewTodo(value: string): void {
    if (value.split(' ').join('')) {
      console.log(`добавил тудушку с текстом ${value}`)
      let newTask = {id:this.foundFreeIndex(this.tempArrayOfTodos), title: value, status: true, collection:0}
      this.serverRequestPost(this.URL, newTask)
      this.tempArrayOfTodos.push(newTask)
    }
    this.newTodotask = ''
  }
}

