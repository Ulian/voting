import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PollService } from '../_services/index';
import { Router } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';


@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html'
})
export class PollDetailsComponent implements OnInit {
  poll: Object;
  share: string;
  pollId: string;
  userid: string;
  message: string;
  messageType: string;
  newOption: string;

  pieChartLabels: string[];
  pieChartData: number[];
  pieChartType = 'pie';

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private router: Router,
    private pollService: PollService,
    private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.pollId = params['id'];
    });
  }

  ngOnInit() {
    const token = localStorage.getItem('loggedUser');

    if (token !== null) {
      this.userid = this.jwtHelper.decodeToken(token)._doc._id;
    }

    this.loadPoll();
  }

  removePoll() {
    this.pollService.removePoll(this.pollId)
      .then(response => {
        this.router.navigate(['/profile']);
      })
      .catch(error => {});
  }

  voteOption(name) {
    this.pollService.voteOption(this.pollId, name)
    .then(response => {
      this.message = response['message'];
      this.messageType = 'success';
      this.loadPoll();
    })
    .catch(error => {
      this.message = error['message'];
      this.messageType = 'danger';
    });
  }

  addOption() {
    this.pollService.addOption(this.pollId, this.newOption)
    .then(response => {
      this.message = response['message'];
      this.messageType = 'success';
      this.newOption = '';
      this.loadPoll();
    })
    .catch(error => {
      this.message = error['message'];
      this.messageType = 'danger';
    });
  }

  loadPoll() {
    this.pollService.getPoll(this.pollId)
      .then(poll => {
        const labels = [];
        const data = [];

        poll['options'].forEach(option => {
          labels.push(option.name);
          data.push(option.votes.length);
        });

        this.pieChartLabels = labels;
        this.pieChartData = data;
        this.poll = poll;
        this.share = encodeURIComponent(window.location.href);
      });
  }

}
