import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorModel } from "@zebu-login/models/Error";
@Component({
  selector: 'app-password-renew',
  templateUrl: './password-renew.component.html',
  styleUrls: ['./password-renew.component.scss']
})
export class PasswordRenewComponent implements OnInit, OnDestroy {

  private zebuLoginErrorSubscription: Subscription;
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor() { }

  ngOnInit() {
    /* Subscribing to error data */
    this.zebuLoginErrorSubscription = ZebuLoginService
      .errorState
      .subscribe((value: ErrorModel) => {
        if (value.IsError) {
          /* Disabling upon error */
          ZebuLoginService.disableProgressBar();
          /* Updating local data */
          this.errorData = value;
        }
      });
  }

  ngOnDestroy(): void {
    this.zebuLoginErrorSubscription.unsubscribe();
  }

}
