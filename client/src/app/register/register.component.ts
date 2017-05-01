import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../_services/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  title = 'Register an account';
  account: any = {};
  message: string;
  messageType: string;
  loading = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  register(username, email, password, passwordConfirm) {
    this.loading = true;
    this.accountService.register(username, email, password, passwordConfirm)
      .then(response => {
        this.message = response['message'];
        this.messageType = 'success';
        this.account = {};
        this.router.navigate(['/login']);
      })
      .catch(error => {
        this.message = error['message'];
        this.messageType = 'danger';
        this.loading = false;
      });
  }
}
