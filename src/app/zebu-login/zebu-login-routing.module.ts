import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZebuLoginComponent } from './zebu-login.component';
import { ChallengeComponent } from './challenge/challenge.component';
import {
  ForgotPasswordComponent
} from './forgot-password/forgot-password.component';
import { IdentifierComponent } from './identifier/identifier.component';
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
        path: 'challenge',
        component: ChallengeComponent
      },
      {
        path: 'forgot',
        component: ForgotPasswordComponent
      },
      {
        path: 'identifier',
        component: IdentifierComponent
      },
      {
        path: 'unblock',
        component: UnblockUserComponent
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'identifier'
      },
    ]
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