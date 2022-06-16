import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodosService } from '../shared/services/todos.service';
import { CreateTodolistModalComponent } from '../create-todolist-modal/create-todolist-modal.component';

@Component({
  selector: 'app-create-todo-modal',
  templateUrl: './create-todo-modal.component.html',
  styleUrls: ['./create-todo-modal.component.scss']
})
export class CreateTodoModalComponent implements OnInit {

  form!: FormGroup;
  
  constructor(private dialogRef: MatDialogRef<CreateTodolistModalComponent>, private todoService: TodosService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    console.log('submit')
    this.todoService.todoCreated$.next(this.form.value)
    this.close();
  }

  close() {
    console.log('close')
    this.dialogRef.close();
  }

}
