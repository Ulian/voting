import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AccountService } from '../../_services/index';

import { NewAccount, Message } from '../../_models/index';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})

export class RegisterComponent {
  account: any = {};
  message: Message;
  loading = false;

  constructor(
    private accountService: AccountService,
    private router: Router) { }

  register(newAccount: NewAccount) {
    this.loading = true;
    this.accountService.register(newAccount)
      .then(response => {
        this.message = {
          text: response['message'],
          type: 'success'
        };
        this.router.navigate(['/login']);
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
