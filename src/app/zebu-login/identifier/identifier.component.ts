import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

/* Feature Model */
import { ROUTEs } from "../models/Route";

/* Feature Service */
import {
  ZebuLoginService,
  COLLECT_SECURITY_TYPEs
} from '../services/zebu-login.service';

@Component({
  selector: 'zebu-login-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
export class IdentifierComponent implements OnInit, OnDestroy {

  private UserID: string = "ZA01001"; //ZA01001 || ZEBULL1
  private collectSecuritySubscription: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) { }

  ngOnInit() {
    /* Disabling loader */
    this.zebuLoginService.disableProgressBar();

    /* Subscribing to zebuLoginService.collectSecurityState property */
    this.collectSecuritySubscription = this.zebuLoginService
      .collectSecurityState
      .subscribe((value: string) => {
        if (
          value === COLLECT_SECURITY_TYPEs.PASSWORD
          || value === COLLECT_SECURITY_TYPEs.MPIN
        ) {
          const path = value === COLLECT_SECURITY_TYPEs.PASSWORD
            ? ROUTEs.PASSWORD.path
            : ROUTEs.M_PIN.path;
          this.router.navigate(
            [`/${path}`, { userid: this.UserID }],
            { relativeTo: this.activatedRoute }
          );
        }
      });
    /* Getting UserID from url params */
    this.activatedRoute.params.subscribe(params => {
      /* Validating UserID in query params to update in component property*/
      const paramUserID = params['userid'];
      if (paramUserID && paramUserID.length > 0) {
        this.UserID = paramUserID;
      }
    });
  }

  ngOnDestroy(): void {
    this.collectSecuritySubscription.unsubscribe();
  }

  onIdentifierSubmit() {
    this.zebuLoginService.submitIdentifier(this.UserID);
  }

  navigate(to: string) {
    this.router.navigate(
      [`${to}?userid=${this.UserID}`],
      { relativeTo: this.activatedRoute }
    );
  }
}
