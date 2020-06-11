import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-unblock-user',
  templateUrl: './unblock-user.component.html',
  styleUrls: ['./unblock-user.component.scss']
})
export class UnblockUserComponent implements OnInit {
  public unblock: FormGroup
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
    this.msg = "Your account has been blocked";
    this.unblock = this.formbuilder.group({
      userId: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      pan: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
    });
    this.spinnerService.stop();
  }

  unblockUser() {
    this.spinnerService.start();
    this.odgenserv.unblockUser(this.unblock.value).subscribe(data => {
      if (data['stat'] == "Ok") {
        var b3JkIjpud = btoa(JSON.stringify(data));
        var returnUrl = btoa(this.returnUrl);
        this.routeTo.navigate(["/login"], { queryParams: { b3JkIjpud, returnUrl } });
      } else {
        this.notOKstat = data["emsg"];
      }
      this.spinnerService.stop();
    }, (err) => {
      console.log("err", err)
      this.err = err.error;
      this.spinnerService.stop();
    }
    );
  }
}
