import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  MatProgressBarModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import {MatCheckboxModule} from '@angular/material/checkbox';


/* Routing Module */
import { ZebuLoginRoutingModule } from './zebu-login-routing.module';

/* Bootstrap Component */
import { ZebuLoginComponent } from './zebu-login.component';

/* Feature Component */
import { IdentifierComponent } from './identifier/identifier.component';
import { ChallengeComponent } from './challenge/challenge.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UnblockUserComponent } from './unblock-user/unblock-user.component';

/* Services only to zebu-login feature module */
import { ZebuLoginServiceModule } from './services/zebu-login-service.module';

@NgModule({
  declarations: [
    ZebuLoginComponent,
    IdentifierComponent,
    ChallengeComponent,
    ForgotPasswordComponent,
    UnblockUserComponent
  ],
  imports: [
    CommonModule,
    FormsModule, /* To support Form related elements */
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    ZebuLoginRoutingModule,
    ZebuLoginServiceModule
  ],
})
export class ZebuLoginModule { }
