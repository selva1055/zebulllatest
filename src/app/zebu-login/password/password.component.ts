import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Service */
import { ZebuLoginService, COLLECT_SECURITY_TYPEs } from '../services/zebu-login.service';
import { ROUTEs } from '../models/Route';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit, OnDestroy {

  private userInfo: any = {
    userId: "ZA01001",
    password: "SleepingOwl@004",// "SleepingOwl@004" | "asd@123",
    isRemembered: false,
  };
  private isAuthenticatedUserSubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() {
    /* Disabling loader */
    this.zebuLoginService.disableProgressBar();

    /* Subscribing to zebuLoginService.isAuthenticatedUser property */
    this.isAuthenticatedUserSubscription = this.zebuLoginService
      .isAuthenticatedUser
      .subscribe((value: boolean) => {
        if (value) {
          this.router.navigate(
            ['/login/challenge', { userid: this.userInfo.userId }],
            { relativeTo: this.activatedRoute }
          );
        }
      });

    /* Getting UserID from url params */
    this.activatedRoute.params.subscribe(params => {
      this.userInfo['userId'] = params['userid'] && params['userid'].length > 0
        ? params['userid'] : "";
    });
  }

  ngOnDestroy(): void {
    this.isAuthenticatedUserSubscription.unsubscribe();
  }

  onEditUserID() {
    /* Enabling loader */
    this.zebuLoginService.enableProgressBar();
    /* Setting collect security type to default as we starting from beginning */
    this.zebuLoginService.setCollectSecurityState(COLLECT_SECURITY_TYPEs.DEFAULT);
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
    /* Enabling loader */
    this.zebuLoginService.enableProgressBar();
    this.zebuLoginService.validatePasswordAuthentication(this.userInfo);
  }

}
