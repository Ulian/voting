import { Component, OnInit } from '@angular/core';

import { PollService } from '../_services/index';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html'
})

export class PollListComponent implements OnInit {
  name: string;
  errorMessage: string;
  polls: object[] = [];
  mode = 'Observable';
  constructor(private pollService: PollService) {
    this.name = 'Poll List';
  }

  ngOnInit() {
    this.pollService.getPolls()
      .then(polls =>
        this.polls = polls.reverse()
      );
  }

}
