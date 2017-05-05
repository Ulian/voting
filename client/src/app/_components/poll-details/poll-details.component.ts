import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Router } from '@angular/router';

import { JwtHelper } from 'angular2-jwt';

import { PollService } from '../../_services/index';

import { Message } from '../../_models/index';


@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html'
})
export class PollDetailsComponent implements OnInit {
  poll: Object;
  share: string;
  pollId: string;
  userid: string;
  message: Message;
  newOption: string;

  pieChartLabels: string[];
  pieChartData: number[];
  pieChartType = 'pie';

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private router: Router,
    private pollService: PollService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.pollId = params['id'];
    });

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
      this.message = {
        text: response['message'],
        type: 'success'
      };
      this.loadPoll();
    })
    .catch(error => {
      this.message = {
        text: error['message'],
        type: 'danger'
      };
    });
  }

  addOption() {
    this.pollService.addOption(this.pollId, this.newOption)
    .then(response => {
      this.message = {
        text: response['message'],
        type: 'success'
      };
      this.newOption = '';
      this.loadPoll();
    })
    .catch(error => {
      this.message = {
        text: error['message'],
        type: 'danger'
      };
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
