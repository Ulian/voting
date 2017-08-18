import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollListComponent,
         PollDetailsComponent,
         RegisterComponent,
         LoginComponent,
         CreateComponent,
         ProfileComponent } from '../../_components/index';

import { AllowLoggedIn, DenyLoggedIn } from '../../_guards/index';

const appRoutes: Routes = [
  { path: 'list', component: PollListComponent },
  { path: 'poll/:id', component: PollDetailsComponent },
  { path: 'login', component: LoginComponent, canActivate: [DenyLoggedIn] },
  { path: 'register', component: RegisterComponent, canActivate: [DenyLoggedIn] },
  { path: 'create', component: CreateComponent, canActivate: [AllowLoggedIn] },
  { path: 'profile', component: ProfileComponent, canActivate: [AllowLoggedIn] },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', component: PollListComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ]
})
export class RoutingModule { }
