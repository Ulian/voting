import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PollListComponent } from '../poll-list/poll-list.component';
import { PollDetailsComponent } from '../poll-details/poll-details.component';
import { RegisterComponent } from '../register/register.component';
import { LoginComponent } from '../login/login.component';
import { CreateComponent } from '../create/create.component';
import { ProfileComponent } from '../profile/profile.component';

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
export class AppRoutingModule { }
