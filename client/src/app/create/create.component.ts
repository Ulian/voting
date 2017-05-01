import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { Router } from '@angular/router';

import { PollService } from '../_services/index';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html'
})

export class CreateComponent {
  title= 'Create a poll';
  question: string;
  options: string[] = ['', ''];
  message: string;
  messageType: string;

  constructor(
    private http: Http,
    private router: Router,
    private pollService: PollService) { }

  submit() {
    const filteredOptions = this.options.filter(option => {
      if (option !== '') {
        return option;
      }
    });

    this.pollService.createPoll(this.question, filteredOptions)
      .then(response => {
        this.message = response['message'];
        this.messageType = 'success';
        this.router.navigate(['/profile']);
      })
      .catch(error => {
        this.message = error['message'];
        this.messageType = 'danger';
      });
  }

  onFocus(index) {
    if (index === (this.options.length - 1)) {
      this.options.push('');
    }
  }

  onBlur(index, event) {
    if (index === (this.options.length - 2) && this.options.length > 2 && this.options[index] === '' && event.keyCode !== 9) {
      this.options.pop();
    }
  }

  customTrackBy(index: number, obj: any): any {
    return index;
  }
}
