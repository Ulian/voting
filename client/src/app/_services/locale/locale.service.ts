import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocaleService {
  constructor(
    private http: Http,
    private config: AppConfig
  ) { }

  changeLocale(locale): Promise<Object> {
    return this.http
      .get(`${this.config.api}/locale/${locale}`, { withCredentials: true })
      .toPromise()
      .then((response) => {
        return response.json();
      })
      .catch(this.handleError);
    }

  private handleError(error: any): Promise < any > {
    // console.error('Error ', JSON.parse(error._body).message)
    return Promise.reject(JSON.parse(error._body) || error);
  };
}
