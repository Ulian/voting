import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AccountService } from '../../_services/index';

@Injectable()
export class AllowLoggedIn implements CanActivate {

    constructor(
      private router: Router,
      private accountService: AccountService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      if (this.accountService.isLogged()) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
    }
}
