import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class AccountService {
  private apiUrl = 'http://localhost/api';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) { }

  register(username, email, password, passwordConfirm): Promise<Object> {
    const account = {
      username,
      email,
      password,
      passwordConfirm
    };

    return this.http
        .post(`${this.apiUrl}/register`, account, { headers: this.headers, withCredentials: true })
        .toPromise()
        .then((response: Response) => {
          return response.json();
        })
        .catch(this.handleError);
  }

  login(login, password): Promise<Object> {
    const account = {
      login,
      password
    };

    return this.http
      .post(`${this.apiUrl}/login`, account, { headers: this.headers, withCredentials: true })
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
      .post(`${this.apiUrl}/profile`, account, { headers: this.headers, withCredentials: true })
      .toPromise()
      .then((response: Response) => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    // console.error('Error ', JSON.parse(error._body).message)
    return Promise.reject(JSON.parse(error._body) || error);
  }
}
