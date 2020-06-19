import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Feature Service */
import { ZebuLoginService } from '../services/zebu-login.service';

@Component({
  selector: 'zebu-login-identifier',
  templateUrl: './identifier.component.html',
  styleUrls: ['./identifier.component.scss']
})
export class IdentifierComponent implements OnInit {

  private userInfo: any = {
    userId: "ZA01001",
    password: "SleepingOwl@004",
    isRemembered: false,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService
  ) { 
    console.warn( "ActivatedRoute: ", activatedRoute );
  }

  ngOnInit() {}

  onIdentifierSubmit() {
    console.warn( "Muje Hindi nahi maalum!" );
    this.zebuLoginService.authenticateUser(this.userInfo);
    /* Subscribing to zebuLoginService.isAuthenticatedUser property */
    this.zebuLoginService.isAuthenticatedUser.subscribe(
      (value: boolean) => {
        console.log("isAuthenticatedUser coming: ", value)
        if( value ) {
          this.router.navigate(
            ['/login/challenge'],
            { relativeTo: this.activatedRoute }
          );
        }
      }
    );
  }
}
