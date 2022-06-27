import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthLayoutComponent } from './shared/layouts/auth-layout/auth-layout.component';
import { SiteLayoutComponent } from './shared/layouts/site-layout/site-layout.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './shared/services/auth.service';
import { TokenInterceptor } from './shared/classes/token.interceptor';
import { TodosPageComponent } from './todos-page/todos-page.component';
import { TodosService } from './shared/services/todos.service';
import { CreateTodolistModalComponent } from './create-todolist-modal/create-todolist-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CreateTodoModalComponent } from './create-todo-modal/create-todo-modal.component';
import { CreateBoardModalComponent } from './create-board-modal/create-board-modal.component';
import { BoardsPageComponent } from './boards-page/boards-page.component';
import { AddUserToBoardComponent } from './add-user-to-board/add-user-to-board.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    AuthLayoutComponent,
    SiteLayoutComponent,
    RegisterPageComponent,
    TodosPageComponent,
    CreateTodolistModalComponent,
    CreateTodoModalComponent,
    CreateBoardModalComponent,
    BoardsPageComponent,
    AddUserToBoardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    DragDropModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDialogModule
  ],
  providers: [
    AuthService,
    TodosService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  entryComponents: [CreateTodolistModalComponent]
})
export class AppModule { }
