import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  aSub!: Subscription;

  constructor(private auth: AuthService, private router: Router) {

  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    })
  }


  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.register(this.form.value).subscribe({
      next: (v) => this.router.navigate(['/login'], {
        queryParams: {
          registered: true
        }
      }),
      error: (e) => {
        this.form.enable()
        MaterialService.toast(e.error.message)
      }
    })
  }

}
