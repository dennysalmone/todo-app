import { Component } from '@angular/core';
import { AuthService } from './shared/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  env = environment
  constructor(private auth: AuthService) {
    
  }

  ngOnInit (): void {
    this.auth.setTokenFromLocalStorage()
  }  

}

