import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodosService } from '../shared/services/todos.service';

@Component({
  selector: 'app-add-user-to-board',
  templateUrl: './add-user-to-board.component.html',
  styleUrls: ['./add-user-to-board.component.scss'],
})

export class AddUserToBoardComponent implements OnInit {

  form!: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<AddUserToBoardComponent>, private todoService: TodosService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.email])
    })
  }

  onSubmit() {
    console.log('submit')
    this.data.acces.push(this.form.value.name)
    this.close();
  }

  deleteUser(u: number) {
    this.data.acces.splice(u, 1)
  }

  checkUserForDelete(user: string) {
    if(user === this.data.author) {
      return false;
    }
    return true;
  }
 
  close() {
    console.log(this.data.acces)
    this.todoService.boardAcces$.next(this.data.acces)
    this.dialogRef.close();
  }
}
