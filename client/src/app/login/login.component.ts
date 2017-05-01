import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../_services/index';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
  title = 'Login into an account';
  account: any = {};
  message: string;
  messageType: string;
  loading = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  login(login, password) {
    this.loading = true;
    this.accountService.login(login, password)
      .then(response => {
        this.message = response['message'];
        this.messageType = 'success';
        this.account = {};
        this.router.navigate(['/list']);
      })
      .catch(error => {
        this.message = error['message'];
        this.messageType = 'danger';
        this.loading = false;
      });
  }
}
