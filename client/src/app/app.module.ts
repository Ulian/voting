import { NgModule,
         FormsModule,
         BrowserModule,
         HttpModule,
         JsonpModule,
         RouterModule,
         MomentModule,
         ChartsModule,
         RoutingModule } from './_modules/index';

import { AppComponent,
         PollListComponent,
         PollDetailsComponent,
         RegisterComponent,
         LoginComponent,
         CreateComponent,
         ProfileComponent } from './_components/index';

import { PollService,
         AccountService,
         LocaleService } from './_services/index';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
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
    AccountService,
    LocaleService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
