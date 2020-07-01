import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZebuLoginComponent } from './zebu-login.component';
import { ConfirmMpinComponent } from './confirm-mpin/confirm-mpin.component';
import { ChallengeComponent } from './challenge/challenge.component';
import {
  ForgotPasswordComponent
} from './forgot-password/forgot-password.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { MpinComponent } from './mpin/mpin.component';
import { PasswordComponent } from './password/password.component';
import {
  PasswordResetComponent
} from './password-reset/password-reset.component';
import { UnblockUserComponent } from './unblock-user/unblock-user.component';

/**
 * We're loading router-outlet inside a ZebuLoginComponent parent component
 */
const routes: Routes = [
  {
    path: '',
    component: ZebuLoginComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'identifier'
      },
      {
        path: '',
        component: IdentifierComponent,
        data: { animation: 'identifier' },
      },
      {
        path: 'challenge',
        component: ChallengeComponent,
        data: { animation: 'challenge' },
      },
      {
        path: 'confirm-mpin',
        component: ConfirmMpinComponent,
        data: { animation: 'confirmMpin' },
      },
      {
        path: 'mpin',
        component: MpinComponent,
        data: { animation: 'mpin' },
      },
      {
        path: 'password',
        component: PasswordComponent,
        data: { animation: 'password' },
      },
      {
        path: 'password/forgot',
        component: ForgotPasswordComponent,
        data: { animation: 'forgot' },
      },
      {
        path: 'password/reset',
        component: PasswordResetComponent,
        data: { animation: 'reset' },
      },
      {
        path: 'unblock',
        component: UnblockUserComponent,
        data: { animation: 'unblock' },
      },
    ],
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      routes
    )
  ],
  exports: [RouterModule]
})
export class ZebuLoginRoutingModule { }