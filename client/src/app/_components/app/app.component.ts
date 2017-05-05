import { Component, OnInit } from '@angular/core';

import { LocaleService, TranslateService, AccountService } from '../../_services/index';

import * as moment from 'moment';

import { Observable, Subscribable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  locale = 'es';

  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService,
    private accountService: AccountService
  ) { }

  ngOnInit() {
    this.translateService.setDefaultLang(this.locale);
    moment.locale(this.locale);
  }

  loggedIn() {
    return this.accountService.isLogged();
  }

  changeLocale(locale) {
    this.localeService.changeLocale(locale)
      .then(response => {
        this.locale = locale;
        this.translateService.setDefaultLang(locale);
        moment.locale(locale);
      });
  }
}
