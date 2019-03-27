import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReactiveFormsModule } from '@angular/forms';
import { IconPickerModule } from 'ngx-icon-picker/dist/index';
import { Angular2FontawesomeModule } from 'angular2-fontawesome/angular2-fontawesome';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';

import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './modules/login/login.component';
import { RegisterComponent } from './modules/register/register.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { PasswordComponent } from './modules/profile/password.component';
import { GroupCreateComponent } from './modules/group/group-create.component';
import { GroupManagementComponent } from './modules/group/group-management.component';
import { GroupCardsComponent } from './modules/group/group-cards.component';
import { GroupInterjectionsComponent } from './modules/group/group-interjections.component';
import { GroupChatComponent } from './modules/group/group-chat.component';
import { CardManagementComponent } from './modules/group/card-management.component';
import { InterjectionManagementComponent } from './modules/group/interjection-management.component';

import {
  ApiService,
  AuthGuard,
  GroupService,
  JwtService,
  UserService,
  HttpTokenInterceptor
} from './shared';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    PasswordComponent,
    GroupCreateComponent,
    GroupManagementComponent,
    GroupCardsComponent,
    GroupInterjectionsComponent,
    GroupChatComponent,
    CardManagementComponent,
    InterjectionManagementComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    ReactiveFormsModule,
    IconPickerModule,
    Angular2FontawesomeModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuard,
    GroupService,
    JwtService,
    UserService,
    HttpClientModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
