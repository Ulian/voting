import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})

export class AppComponent implements OnInit {
  private apiUrl = 'http://localhost/api';

  logged = false;
  locale = 'es';
  localeText = 'EN';

  constructor(
    private http: Http
  ) {}

  ngOnInit() {
    this.isLogged();
  }

  isLogged () {
    this.logged = (localStorage.getItem('loggedUser') !== null);
    return this.logged;
  }

  changeLocale() {
    this.http.get(`${this.apiUrl}/locale/${this.locale}`, { withCredentials: true })
      .toPromise()
      .then(response => {
        this.locale = (this.locale === 'es') ? 'en' : 'es';
        this.localeText = (this.locale === 'es') ? 'ES' : 'EN';
      });
  }
}
