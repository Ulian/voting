import { Component, OnInit } from '@angular/core';

import { PollService } from '../../_services/index';

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html'
})

export class PollListComponent implements OnInit {
  polls: object[] = [];

  constructor(private pollService: PollService) { }

  ngOnInit() {
    this.pollService.getPolls()
      .then(polls =>
        this.polls = polls.reverse()
      );
  }
}
