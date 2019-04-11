import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { AuthGuard } from './shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/password', component: PasswordComponent },
      { path: 'group/create', component: GroupCreateComponent },
      { path: 'group/:id', component: GroupManagementComponent },
      { path: 'group/:id/cards', component: GroupCardsComponent },
      { path: 'group/:id/cards/:cardID', component: CardManagementComponent },
      { path: 'group/:id/interjections', component: GroupInterjectionsComponent },
      { path: 'group/:id/interjections/:interjectionID', component: InterjectionManagementComponent },
      { path: 'group/:id/chat', component: GroupChatComponent },
    ]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }