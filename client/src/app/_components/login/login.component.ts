import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../_services/index';

import { LoginAccount, Message } from '../../_models/index';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent {
  account: any = {};
  message: Message;
  loading = false;

  constructor(
    private accountService: AccountService,
    private router: Router
  ) {}

  login(loginAccount: LoginAccount) {
    this.loading = true;
    this.accountService.login(loginAccount)
      .then(response => {
        this.message = {
          text: response['message'],
          type: 'success'
        };
        this.account = {};
        this.router.navigate(['/list']);
      })
      .catch(error => {
        this.message = {
          text: error['message'],
          type: 'danger'
        };
        this.loading = false;
      });
  }
}
