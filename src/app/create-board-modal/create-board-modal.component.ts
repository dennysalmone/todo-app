import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TodosService } from '../shared/services/todos.service';

@Component({
  selector: 'app-create-board-modal',
  templateUrl: './create-board-modal.component.html',
  styleUrls: ['./create-board-modal.component.scss']
})

export class CreateBoardModalComponent implements OnInit {

  form!: FormGroup;
  
  constructor(private dialogRef: MatDialogRef<CreateBoardModalComponent>, private todoService: TodosService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    console.log('submit')
    this.todoService.boardCreated$.next(this.form.value)
    this.close();
  }
 
  close() {
    console.log('close')
    this.dialogRef.close();
  }
}