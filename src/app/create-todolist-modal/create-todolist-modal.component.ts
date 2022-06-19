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

  onSubmit() {
    console.log('submit')
    this.todoService.todoListCreated$.next(this.form.value)
    this.close();
  }
 
  close() {
    console.log('close')
    this.dialogRef.close();
  }
}
