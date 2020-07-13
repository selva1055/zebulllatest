import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as Moment from 'moment';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from '@zebu-login/models/Route';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  private zebuLoginErrorSubscription: Subscription;
  private zebuLoginStateSubscription: Subscription;
  private userInfo: any = {
    userId: "",
    pan: "",
    email: "",
    dob: "",
  };
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) { }

  ngOnInit() {
    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {
        console.warn("PasswordResetComponent, zebuLoginStateSubscription: ", value)
        if (
          value === LOGIN_STATE.PASSWORD_RESET_SUCCESS
        ) {
          ZebuLoginService.disableProgressBar();
          /* TODO: Show some message and move to default login page */
          this.router.navigate(
            [`/${ROUTEs.LOGIN.path}`]
          );
          return
        }
        /* TODO: Handle other login state such as error */
      });
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
    this.zebuLoginStateSubscription.unsubscribe();
  }

  navigate(to: string) {
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

  handlePasswordReset() {
    /* Validating input fields */
    const {
      userId,
      pan,
      email,
      dob,
    } = this.userInfo;
    console.warn(this.userInfo)
    if (
      userId.length >= 4 && new RegExp("^[a-zA-Z0-9]+$").test(userId)
      && pan.length >= 4
      && new RegExp("/^[^\s@]+@[^\s@]+\.[^\s@]+$/").test(email)
      && Moment(dob, 'YYYY-MM-DD', true).isValid()
    ) {
      ZebuLoginService.enableProgressBar();
      this.zebuLoginService.resetPassword({
        userId,
        pan,
        email,
        dob: Moment(dob).format('DD-MM-YYYY'),
      });
    }
    ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
  }

}
