import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from '@angular/router';

import { PollListComponent,
         PollDetailsComponent,
         RegisterComponent,
         LoginComponent,
         CreateComponent,
         ProfileComponent } from '../../_components/index';

const appRoutes: Routes = [
  { path: 'list', component: PollListComponent },
  { path: 'poll/:id', component: PollDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'create', component: CreateComponent },
  { path: 'profile', component: ProfileComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: '**', component: PollListComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ]
})
export class RoutingModule { }
