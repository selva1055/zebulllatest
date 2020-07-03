import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

/* Feature Service */
import { ZebuLoginService, COLLECT_SECURITY_TYPEs } from '../services/zebu-login.service';
import { ROUTEs } from '../models/Route';

@Component({
  selector: 'app-mpin',
  templateUrl: './mpin.component.html',
  styleUrls: ['./mpin.component.scss']
})
export class MpinComponent implements OnInit {

  private userInfo: any = {
    userId: "ZA01001",
    mpin: "123456",
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() {
    /* Disabling loader */
    this.zebuLoginService.disableProgressBar();

    /* Getting UserID from url params */
    this.activatedRoute.params.subscribe(params => {
      this.userInfo['userId'] = params['userid'] && params['userid'].length > 0
        ? params['userid'] : "";
    });
  }

  navigate(to: string) {
    this.router.navigate(
      [to],
      { relativeTo: this.activatedRoute }
    );
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

  onSubmit() {
    console.warn("Handle it bro!!");
  }

}
