import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from '@zebu-login/models/Route';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {

  private userInfo: any = {
    userId: "",
    password: "",
    isRemembered: false,
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

    console.warn(ZebuLoginService.loginData);
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
        if (value === LOGIN_STATE.PASSWORD_SUCCESS) {
          this.router.navigate(
            [`${ROUTEs.CHALLENGE.path}`],
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

  onEditUserID() {
    /* Enabling loader */
    ZebuLoginService.enableProgressBar();
    /* Setting collect security type to default as we starting from beginning */
    ZebuLoginService.setLoginState(LOGIN_STATE.DEFAULT);
    /* Navigation to initial page which is identifier*/
    this.router.navigate(
      [
        `/${ROUTEs.LOGIN.path}`,
        { userid: this.userInfo.userId }
      ],
      { relativeTo: this.activatedRoute }
    );
  }

  validateUser() {
    if (this.userInfo.password.length >= 4) {
      /* Enabling loader */
      ZebuLoginService.enableProgressBar();
      this.zebuLoginService.validatePasswordAuthentication(this.userInfo);
      return;
    }
    ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
  }

  navigate(to: string) {
    this.router.navigate(
      [`${to}`],
      { relativeTo: this.activatedRoute }
    );
  }

}
