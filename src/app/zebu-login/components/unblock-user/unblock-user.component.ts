import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* App Services */
import { ZebuodrGentrService } from '@app/services/zebuodr-gentr.service';

/* Feature Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { LOGIN_STATE } from "@zebu-login/models/Navigation";
import { ROUTEs } from '@zebu-login/models/Route';

@Component({
  selector: 'app-unblock-user',
  templateUrl: './unblock-user.component.html',
  styleUrls: ['./unblock-user.component.scss']
})
export class UnblockUserComponent implements OnInit, OnDestroy {

  private zebuLoginErrorSubscription: Subscription;
  private zebuLoginStateSubscription: Subscription;
  private userInfo: any = {
    userId: "",
    pan: "",
    email: "",
  };
  private errorData: ErrorModel = {
    IsError: false,
    ErrorMsg: "",
  };

  constructor(
    public odgenserv: ZebuodrGentrService,
    private zebuLoginService: ZebuLoginService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    /* Subscribing to zebuLoginService.zebuLoginState property */
    this.zebuLoginStateSubscription = ZebuLoginService
      .zebuLoginState
      .subscribe((value: string) => {
        console.warn("PasswordResetComponent, zebuLoginStateSubscription: ", value)
        if (
          value === LOGIN_STATE.UNBLOCK_SUCCESS
        ) {
          ZebuLoginService.disableProgressBar();
          /* TODO: Show some message and move to default login page */
          this.router.navigate(
            [`/${ROUTEs.LOGIN.path}`]
          );
          return
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
    this.zebuLoginErrorSubscription.unsubscribe();
  }

  navigate(to: string) {
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
  }

  /* Validate unblock fields */
  validateFields() {
    const {
      userId,
      pan,
      email,
    } = this.userInfo;
    /* Validate fields as per requriement */
    if (
      userId.length >= 4 && new RegExp("^[a-zA-Z0-9]+$").test(userId)
      && pan.length >= 4
      && new RegExp("/^[^\s@]+@[^\s@]+\.[^\s@]+$/").test(email)
    ) {
      return true;
    }
    return false;
  }

  /**
   * Collect elements data and pass it as json to the service.
   */
  handleUnblock() {
    if (this.validateFields()) {
      ZebuLoginService.enableProgressBar();
      /* Calling service to unblock an user */
      this.zebuLoginService.unblockUser(
        this.userInfo
      );
    }
    ZebuLoginService.setErrorState(true, ErrorConstant.INVALID_CREDENTIALS);
  }

}
