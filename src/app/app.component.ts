import { Component } from '@angular/core';
import { task, taskObj } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-frontend';
  port: number = 3000;
  res: any = 'placeholder';
  newTodotask: string = '';
  // URL: string = `http://localhost:${this.port}/`
  tempArrayOfTodos: task[] = [
    {id:1, title: "покушать", status: true},
    {id:2, title: "покакать", status: true},
    {id:3, title: "почесаться", status: false},
    {id:4, title: "набрать воды", status: false},
    {id:5, title: "пригтовить ужин", status: true},
    ]; // временно, позже получаем из локалхост/3000 как this.res

  ngOnInit (): void {
    // this.serverRequest(this.URL)
  }

  serverRequest(URL: string): void {
    fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.res = data
    });
  }

  toggleStyleCheck(todo: task) {
    if(todo?.status) {
      return {'color': 'green'}
    } else {
      return {'color': 'red'}
    }
  }

  deleteTask(todo: task): void {
    console.log('удалил тудушку с тексом ', todo?.title);
    var index = this.tempArrayOfTodos.indexOf(todo);
    this.tempArrayOfTodos.splice(index, 1);     
  }

  toggleStatus(todo: task): void {
    console.log(`переключил статус тудушки ${todo?.title} на ${!(todo?.status)}`);
    (todo as taskObj).status = !(todo as taskObj).status;
  }

  createNewTodo(value: string): void {
    console.log(`добавил тудушку с текстом ${value}`)
    if (value) {
      this.tempArrayOfTodos.push({id:1, title: value, status: true})
      this.newTodotask = ''
    }
  }
}
