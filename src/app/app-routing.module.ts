import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BoardsPageComponent } from "./boards-page/boards-page.component";
import { LoginPageComponent } from "./login-page/login-page.component";
import { RegisterPageComponent } from "./register-page/register-page.component";
import { AuthGuard } from "./shared/classes/auth.guard";
import { AuthLayoutComponent } from "./shared/layouts/auth-layout/auth-layout.component";
import { SiteLayoutComponent } from "./shared/layouts/site-layout/site-layout.component";
import { TodosPageComponent } from "./todos-page/todos-page.component";

const routes: Routes = [
    {
        path: "", component: AuthLayoutComponent, children: [
            {path: "login", component: LoginPageComponent},
            {path: "register", component: RegisterPageComponent},
            {path: "", redirectTo: "login", pathMatch: 'full'},           
        ]
    },
    {
        path: "", component: SiteLayoutComponent, canActivate: [AuthGuard], children: [
            {path: "todolist", component: TodosPageComponent},
            {path: "boards", component: BoardsPageComponent},
        ]
    }
]

@NgModule ({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ]
})



export class AppRoutingModule {

}