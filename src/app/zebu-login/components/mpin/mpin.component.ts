import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from '@zebu-login/models/Route';

@Component({
  selector: 'app-mpin',
  templateUrl: './mpin.component.html',
  styleUrls: ['./mpin.component.scss']
})
export class MpinComponent implements OnInit, OnDestroy {

  private userInfo: any = {
    userId: "",
    mpin: "",
  };
  private zebuLoginStateSubscription: Subscription;
  private zebuLoginErrorSubscription: Subscription;
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) {
    /* Getting UserID from service */
    this.userInfo['userId'] = ZebuLoginService.loginData.UserID;
  }

  ngOnInit() {
    /* Disabling loader */
    ZebuLoginService.disableProgressBar();

    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {
        if (value === LOGIN_STATE.HOME) {
          this.router.navigate(
            [`/home`],
            { relativeTo: this.activatedRoute }
          );
          return
        }
        if (value === LOGIN_STATE.DEFAULT) {
          /* Navigation to initial page which is identifier*/
          this.router.navigate(
            [
              `/${ROUTEs.LOGIN.path}`,
              { userid: this.userInfo.userId }
            ],
            { relativeTo: this.activatedRoute }
          );
        }
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
    this.zebuLoginStateSubscription.unsubscribe();
    this.zebuLoginErrorSubscription.unsubscribe();
  }

  navigate(to: string) {
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

  onEditUserID() {
    /* Enabling loader */
    ZebuLoginService.enableProgressBar();
    /* Setting login state to default as we starting from beginning */
    ZebuLoginService.setLoginState(LOGIN_STATE.DEFAULT);
  }

  onSubmit() {
    const { mpin, userId } = this.userInfo

    /* Validate whether user entered input or not */
    if (mpin.length === 0) {
      ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
      return;
    }

    ZebuLoginService.enableProgressBar();
    // auithenticate with pin
    this.zebuLoginService.validateMPin(userId, mpin);
  }

}
