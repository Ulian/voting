import { NgModule,
         FormsModule,
         BrowserModule,
         HttpModule,
         JsonpModule,
         RouterModule,
         MomentModule,
         ChartsModule,
         RoutingModule,
         TranslateModule } from './_modules/index';

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

import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Http } from '@angular/http';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RoutingModule,
    HttpModule,
    JsonpModule,
    MomentModule,
    ChartsModule,
    RouterModule,
    TranslateModule.forRoot({
        provide: TranslateLoader,
        useFactory: (http: Http) => new TranslateStaticLoader(http, '../assets/locales', '.json'),
        deps: [Http]
    })
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
