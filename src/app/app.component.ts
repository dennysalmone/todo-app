import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private auth: AuthService) {
    
  }

  ngOnInit (): void {
    // let potetntialToken = localStorage.getItem('auth-token')
    // if (potetntialToken !== null) {
    //   this.auth.setToken(potetntialToken)
    // }
    this.auth.setTokenFromLocalStorage()
  }  

}

