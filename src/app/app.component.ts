import { Component } from '@angular/core';

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
  URL: string = 'https://api.punkapi.com/v2/beers?page=1&per_page=1'

  ngOnInit () {
    this.dataDefinitionFromRequest()
  }

  serverRequest(URL: string): any {
    fetch(URL)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.res = data[0]
    });
  }

  dataDefinitionFromRequest() {
    try {
      this.res = this.serverRequest(this.URL);
    } catch(e) {
      console.log(e)
    }
    console.log(this.res)
  }
}
