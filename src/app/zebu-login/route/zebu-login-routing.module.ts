import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ZebuLoginComponent } from '../zebu-login.component';
import { ConfirmMpinComponent } from '../confirm-mpin/confirm-mpin.component';
import { ChallengeComponent } from '../challenge/challenge.component';
import { IdentifierComponent } from '../identifier/identifier.component';
import { MpinComponent } from '../mpin/mpin.component';
import { PasswordComponent } from '../password/password.component';
import {
  PasswordForgotComponent
} from '../password-forgot/password-forgot.component'
import {
  PasswordResetComponent
} from '../password-reset/password-reset.component';
import { UnblockUserComponent } from '../unblock-user/unblock-user.component';

/* Feature Module */
import { ROUTEs } from "../models/Route";

/**
 * We're loading router-outlet inside a ZebuLoginComponent parent component
 */
const routes: Routes = [
  {
    path: '',
    component: ZebuLoginComponent,
    data: { animation: ROUTEs.IDENTIFIER.id },
    children: [
      {
        path: ROUTEs.IDENTIFIER.path,
        component: IdentifierComponent,
        data: { animation: ROUTEs.IDENTIFIER.id },
      },
      {
        path: ROUTEs.CHALLENGE.path,
        component: ChallengeComponent,
        data: { animation: ROUTEs.CHALLENGE.id },
      },
      {
        path: ROUTEs.CONFIRM_M_PIN.path,
        component: ConfirmMpinComponent,
        data: { animation: ROUTEs.CONFIRM_M_PIN.id },
      },
      {
        path: ROUTEs.M_PIN.path,
        component: MpinComponent,
        data: { animation: ROUTEs.M_PIN.id },
      },
      {
        path: ROUTEs.PASSWORD.path,
        component: PasswordComponent,
        data: { animation: ROUTEs.PASSWORD.id },
      },
      {
        path: ROUTEs.PASSWORD_FORGOT.path,
        component: PasswordForgotComponent,
        data: { animation: ROUTEs.PASSWORD_FORGOT.id },
      },
      {
        path: ROUTEs.PASSWORD_RESET.path,
        component: PasswordResetComponent,
        data: { animation: ROUTEs.PASSWORD_RESET.id },
      },
      {
        path: ROUTEs.UNBLOCK.path,
        component: UnblockUserComponent,
        data: { animation: ROUTEs.UNBLOCK.id },
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