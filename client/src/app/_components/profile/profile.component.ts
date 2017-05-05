import { Component, OnInit } from '@angular/core';

import { AccountService } from '../../_services/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  account: object = {};

  constructor(private accountService: AccountService) { }

  ngOnInit() {
    this.accountService.profile()
      .then(response => {
        this.account['username'] = response['username'];
        this.account['polls'] = response['polls'];
      })
      .catch(error => {
        console.log(error);
      });
  }

}
