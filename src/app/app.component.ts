import { Component } from '@angular/core';
import { task, taskObj } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-frontend';
  data: any = 'placeholder';
  newTodotask: string = '';
  URL: string = `http://localhost:3000/get-to-front`
  URLtoPost: string = `http://localhost:3000/post-from-front`
  URLtoDelete: string = `http://localhost:3000/delete-from-front`
  URLtoPut: string = `http://localhost:3000/put-from-front`
  tempArrayOfTodos: task[] = [
    // {id:7, title: "покушать", status: true}
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
      return {'color': 'green'}
    } else {
      return {'color': 'red'}
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
    this.serverRequestDelete(this.URLtoDelete, todo)
  }

  toggleStatus(todo: task): void {
    console.log(`переключил статус тудушки ${todo?.title} на ${!(todo?.status)}`);
    (todo as taskObj).status = !(todo as taskObj).status;
    this.serverRequestPut(this.URLtoPut, todo)
  }

  createNewTodo(value: string): void {
    if (value.split(' ').join('')) {
      console.log(`добавил тудушку с текстом ${value}`)
      let newTask = {id:this.foundFreeIndex(this.tempArrayOfTodos), title: value, status: true}
      this.serverRequestPost(this.URLtoPost, newTask)
      this.tempArrayOfTodos.push(newTask)
    }
    this.newTodotask = ''
  }
}

