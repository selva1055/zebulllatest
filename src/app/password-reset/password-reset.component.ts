import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  public passReset: FormGroup
  notOKstat: any;
  err: any;
  returnUrl: string;
  msg: any;

  constructor(
    public formbuilder: FormBuilder, 
    private spinnerService: NgxUiLoaderService,
    public odgenserv: ZebuodrGentrService,
    private actroute: ActivatedRoute,
    public routeTo: Router
    ){ }

  ngOnInit() {
    this.spinnerService.start();
    this.returnUrl = this.actroute.snapshot.queryParams['returnUrl'] || '/';
    console.log(this.returnUrl);
    
    this.passReset = this.formbuilder.group({
      confPass: ['', [Validators.required, Validators.minLength(4)]],
      oldPass: ['', [Validators.required, Validators.minLength(4)]],
      newPass: ['', [Validators.required, Validators.minLength(4)]],
    });
    this.spinnerService.stop();
  }

  resetNow() {
    console.log(this.passReset.value);
    let obj = this.passReset.value;
    if(obj.newPass == obj.confPass){
      this.notOKstat = null;
      let jsonObj = {
        "oldPassword" : obj.oldPass,
        "newPassword" : obj.newPass,
        "preLogin" : 'Y',
        "userId": this.odgenserv.getUserId(),
        "userSessionID": this.odgenserv.getSessionToken()
      }
      this.spinnerService.start();
      this.odgenserv.resetPasswordPreLogin(jsonObj).subscribe(data => {
        this.spinnerService.stop();
        if (data['stat'] == "Ok") {
          var b3JkIjpud = btoa(JSON.stringify(data));
          var returnUrl = btoa(this.returnUrl);
          this.routeTo.navigate(["/login"], { queryParams: { b3JkIjpud, returnUrl } });
        } else if(data['stat'] == "Not_Ok") {
          this.notOKstat = data["emsg"];
        }
        
      }, (err) => {
        console.log("err", err)
        this.err = err.error;
        this.spinnerService.stop();
      }
      );
    }else{
      this.notOKstat = "Password did not matched";
    }
  }

  goToResetPassword(){
    this.passReset.value['oldPass'] = ""; 
    this.passReset.value['newPass'] = ""; 
    this.passReset.value['confPass'] = ""; 
  }
}
