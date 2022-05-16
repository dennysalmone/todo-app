import { Component } from '@angular/core';
import { task } from './types/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-todo-frontend';
  port: number = 3000;
  res: any = 'placeholder';
  // URL: string = `http://localhost:${this.port}/`
  URL: string = 'https://api.punkapi.com/v2/beers?page=1&per_page=2'
  tempArrayOfTodos: task[] = [
    {id:1, title: "покушать", status: true},
    {id:2, title: "покакать", status: true},
    {id:3, title: "почесаться", status: false},
    {id:4, title: "набрать воды", status: false},
    {id:5, title: "пригтовить ужин", status: true},
    ]; // временно, позже получаем из локалхост/3000 как this.res

  ngOnInit (): void {
    this.serverRequest(this.URL)
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

  deleteTask(todo: task): void {
    console.log(todo?.id + ' мы пока не можем удалить это, НО ОЧЕНЬ СТАРАЕМСЯ')
  }

  onBodyClick(): void {
    console.log(this.res)
  }
}
