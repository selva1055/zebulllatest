import { Component, OnInit } from '@angular/core';

/* App Services */
import { ZebuodrGentrService } from '../../services/zebuodr-gentr.service';

/* Feature Service */
import { ZebuLoginService } from '../services/zebu-login.service';

@Component({
  selector: 'app-unblock-user',
  templateUrl: './unblock-user.component.html',
  styleUrls: ['./unblock-user.component.scss']
})
export class UnblockUserComponent implements OnInit {

  private userInfo: any = {
    userId: "",
    pan: "",
    email: "",
  };

  constructor(
    public odgenserv: ZebuodrGentrService,
    private zebuLoginService: ZebuLoginService,
  ) { }

  ngOnInit() {
    // this.unblockForm = new FormGroup({
    //   userId: new FormControl(
    //     "", [
    //     Validators.required,
    //     Validators.minLength(4),
    //     Validators.pattern('^[a-zA-Z0-9]+$')
    //   ]),
    //   pan: new FormControl(
    //     "", [
    //     Validators.required,
    //     Validators.minLength(4),
    //     Validators.pattern('^[a-zA-Z0-9]+$')
    //   ]),
    //   email: new FormControl(
    //     "", [
    //     Validators.required,
    //     Validators.minLength(4),
    //     Validators.pattern('^[a-zA-Z0-9]+$')
    //   ]),
    // });
  }

  /* Validate unblock fields */
  validateFields() {
    /* TODO: Validate fields as per requriement */
    return true;
  }

  /**
   * Collect elements data and pass it as json to the service
   * @param $event Submit event from form
   */
  handleUnblock(event: any) {
    console.warn(
      "Handle user unblock: ",
      this.userInfo,
    );
    if(this.validateFields()) {
      /* Calling service to unblock an user */
      this.zebuLoginService.unblockUser(
        this.userInfo
      );
    }
  }

}
