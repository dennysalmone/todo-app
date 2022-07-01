import { Component, OnInit } from '@angular/core';
import { Board, PostBoard, DeleteBoard, changeAccesList, receivedBoards } from '../types/types';
import { TodosService } from '../shared/services/todos.service';
import { MaterialService } from '../shared/classes/material.service';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subscription } from 'rxjs/internal/Subscription';
import { CreateBoardModalComponent } from '../create-board-modal/create-board-modal.component';
import { Router } from '@angular/router';
import { AddUserToBoardComponent } from '../add-user-to-board/add-user-to-board.component';

@Component({
  selector: 'app-boards-page',
  templateUrl: './boards-page.component.html',
  styleUrls: ['./boards-page.component.scss']
})

export class BoardsPageComponent implements OnInit {

  aSub!: Subscription;
  bSub!: Subscription;
  cSub!: Subscription;
  dialogBoardSub!: Subscription;
  selectedBoard: number = 0;
  URL: string = `${environment.URL}todo`;
  boards: Board[] = [];
  userEmail: string = '';

  constructor(private todoService: TodosService, private dialog: MatDialog, private router: Router) {

  }

  ngOnInit (): void {
    this.getBoards()
  }

  openBoardDialog (): void {
    this.dialogBoardSub = this.todoService.boardCreated$.subscribe(
        (data) => {
          this.dialogBoardSub.unsubscribe()
          this.postBoard(data as {name: string})
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(CreateBoardModalComponent, dialogConfig)
  }

  changeAccesListDialog (board: Board): void {
    let acces = board.access;
    this.dialogBoardSub = this.todoService.boardAccess$.subscribe(
        (data) => {
          this.dialogBoardSub.unsubscribe()
          console.log(data)
          this.changeAccesList(data as any, board.id)
        }
    )
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(AddUserToBoardComponent, { data: { acces: acces, author: this.userEmail } } )
  }

  changeAccesList(access: string[], id: number) {
    let data: changeAccesList = {access: access, boardId: id}
    this.cSub = this.todoService.changeAccessListBoard(data).subscribe({
      next: () => {
        console.log('changed access')
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  postBoard(data: PostBoard): void { // post board
    this.aSub = this.todoService.createBoard(data).subscribe({
      next: (v) => {
        this.boards.push(v)
        this.router.navigate([`/todolist`], { queryParams: { list: this.boards.length-1 }});// todolist?list=3
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  checkUserIsAuthor(board: Board) {
    if(this.userEmail === board.author) {
      return true;
    }
    return false;
  }

  selectBoard(index: number): void {
    this.selectedBoard = index;
    localStorage.setItem('Board', String(this.selectedBoard));
  }

  redirectToBoard(index: number): void {
    this.selectBoard(index)
    this.router.navigate([`/todolist`], { queryParams: { list: index }});// todolist?list=3
  }
  
  checkSelectedBoard(index: number): boolean {
    return this.selectedBoard === index;
  }

  currentBoardCheck(index: number): boolean {
    if(this.selectedBoard === index) {
      return true;
    }
    return false;
  }

  getBoards(): void {
    this.bSub = this.todoService.getBoards().subscribe({
      next: (v: receivedBoards) => {
        this.boards = v.boards
        this.userEmail = v.email
        this.checkLocalStorage()
      },
      error: (e) => {
        MaterialService.toast(e.error.message)
      }
    })
  }

  checkLocalStorage(): void {
    this.selectedBoard = Number(localStorage.getItem('Board'));
  }

  checkBoardForDelete(z: number, board: Board): boolean {
    if (this.boards[z].lists.length) {
      return false;
    }
    return true;
  }

  deleteBoard(z: number, board: Board): void {
    if (!this.boards[z].lists.length) {
      let data: DeleteBoard = { boardId: board.id }
      this.bSub = this.todoService.deleteBoard(data).subscribe({
        next: () => {
          this.boards.splice(z, 1);
        },
        error: (e) => {
          MaterialService.toast(e.error.message)
        }
      })
    }
    if(this.selectedBoard > z) {
      this.selectBoard(this.selectedBoard-1)
    } else if (this.selectedBoard = z) {
      this.selectBoard(0)
    }
    return;
  }

}
