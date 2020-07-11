import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

/* Routing Module */
import { ZebuLoginRoutingModule } from './route/zebu-login-routing.module';

/* Bootstrap Component */
import { ZebuLoginComponent } from './zebu-login.component';

/* Services only to zebu-login feature module */
import { ZebuLoginServiceModule } from './services/zebu-login-service.module';

/* Feature Component */
import { IdentifierComponent } from './components/identifier/identifier.component';
import { ChallengeComponent } from './components/challenge/challenge.component';
import { UnblockUserComponent } from './components/unblock-user/unblock-user.component';
import { MpinComponent } from './components/mpin/mpin.component';
import { PasswordComponent } from './components/password/password.component';
import { ConfirmMpinComponent } from './components/confirm-mpin/confirm-mpin.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { PasswordForgotComponent } from './components/password-forgot/password-forgot.component';
import { PasswordRenewComponent } from './components/password-renew/password-renew.component';
/* Service */
// import { }

@NgModule({
  declarations: [
    ZebuLoginComponent,
    IdentifierComponent,
    ChallengeComponent,
    UnblockUserComponent,
    MpinComponent,
    PasswordComponent,
    ConfirmMpinComponent,
    PasswordResetComponent,
    PasswordForgotComponent,
    PasswordRenewComponent
  ],
  imports: [
    CommonModule,
    FormsModule, /* To support Form related elements */
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    ZebuLoginRoutingModule,
    ZebuLoginServiceModule
  ],
})
export class ZebuLoginModule { }
