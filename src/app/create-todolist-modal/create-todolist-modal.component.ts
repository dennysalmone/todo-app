import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodosService } from '../shared/services/todos.service';

@Component({
  selector: 'app-create-todolist-modal',
  templateUrl: './create-todolist-modal.component.html',
  styleUrls: ['./create-todolist-modal.component.scss']
})

export class CreateTodolistModalComponent implements OnInit {

  form!: FormGroup;
  
  constructor(private dialogRef: MatDialogRef<CreateTodolistModalComponent>, private todoService: TodosService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      desc: new FormControl(null, [Validators.required]),
    })
  }

  submit() {
    console.log('submit')
    this.todoService.newTodoList$.next(this.form.value)
    this.close();
  }

  close() {
    console.log('close')
    this.dialogRef.close();
  }

  // checkInputs(): boolean {
  //   if(this.form.value.name && this.form.value.desc) {
  //     return false;
  //   } else {
  //     return true;
  //   }
  // }

}
