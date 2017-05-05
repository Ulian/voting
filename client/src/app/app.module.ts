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

import { AllowLoggedIn, DenyLoggedIn } from './_guards/index';


import { AppConfig } from './app.config';

import { TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { Http } from '@angular/http';

export function HttpLoaderFactory(http: Http) {
    return new TranslateStaticLoader(http, '../assets/locales', '.json');
}

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
        useFactory: HttpLoaderFactory,
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
    LocaleService,
    AllowLoggedIn,
    DenyLoggedIn,
    AppConfig
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
