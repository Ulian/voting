import { Component, OnInit } from '@angular/core';

import { LocaleService, TranslateService } from '../../_services/index';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private apiUrl = 'http://localhost/api';

  logged = false;
  locale = 'es';

  constructor(
    private localeService: LocaleService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.translateService.setDefaultLang(this.locale);
    moment.locale(this.locale);
    this.isLogged();
  }

  isLogged () {
    this.logged = (localStorage.getItem('loggedUser') !== null);
    return this.logged;
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
