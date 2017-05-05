import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';

import { NewAccount, LoginAccount } from '../../_models/index';

import { AppConfig } from '../../app.config';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    private config: AppConfig) { }

  register(newAccount: NewAccount): Promise<Object> {
    return this.http
      .post(`${this.config.api}/register`, newAccount, { headers: this.headers, withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  login(loginAccount: LoginAccount): Promise<Object> {
    return this.http
      .post(`${this.config.api}/login`, loginAccount, { headers: this.headers, withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        const r = response.json();
        localStorage.setItem('loggedUser', r['token']);
        return r;
      })
      .catch(this.handleError);
  }

  logout() {
    localStorage.removeItem('loggedUser');
  }

  profile(): Promise<Object> {
    const account = {
      'token': localStorage.getItem('loggedUser')
    };
    return this.http
      .post(`${this.config.api}/profile`, account, { headers: this.headers, withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  isLogged () {
    return (localStorage.getItem('loggedUser') !== null);
  }

  private handleError(error: any): Promise<any> {
    // console.error('Error ', JSON.parse(error._body).message)
    return Promise.reject(JSON.parse(error._body) || error);
  }
}
