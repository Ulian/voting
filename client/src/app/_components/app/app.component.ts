import { Component, OnInit } from '@angular/core';

import { LocaleService } from '../../_services/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private apiUrl = 'http://localhost/api';

  logged = false;
  locale = 'es';

  constructor(
    private localeService: LocaleService
  ) {}

  ngOnInit() {
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
      });
  }
}
