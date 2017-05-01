import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, JsonpModule } from '@angular/http';
import { MomentModule } from 'angular2-moment';
import { ChartsModule } from 'ng2-charts';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PollListComponent } from './poll-list/poll-list.component';
import { PollDetailsComponent } from './poll-details/poll-details.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CreateComponent } from './create/create.component';
import { ProfileComponent } from './profile/profile.component';

import { PollService, AccountService } from './_services/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    JsonpModule,
    MomentModule,
    ChartsModule,
    RouterModule
  ],
  declarations: [
    AppComponent,
    PollListComponent,
    PollDetailsComponent,
    RegisterComponent,
    LoginComponent,
    CreateComponent,
    ProfileComponent
  ],
  providers: [
    PollService,
    AccountService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
