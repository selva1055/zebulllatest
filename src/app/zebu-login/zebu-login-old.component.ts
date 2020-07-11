import {
  Component,
  OnInit
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { ApiService as ZebuLoginAPIService } from "./services/api.service";
import { Router, ActivatedRoute } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-zebu-login-old',
  templateUrl: './zebu-login-old.component.html',
  styleUrls: ['./zebu-login-old.component.scss']
})
export class ZebuLoginComponent implements OnInit {
  public zebulogin: FormGroup;
  public forgotPass: FormGroup;
  public zebufauthen: FormGroup;
  public zebufauthenreset: FormGroup;
  public passReset: FormGroup;
  public unblock: FormGroup;
  hide = true;
  oldhide = true;
  newhide = true;
  conformhide = true;
  public err: any;
  returnUrl: string;
  notOKstat: any;
  showForget: boolean = false;
  countDown;
  localPublicKey: string;
  show_hide_flag = 1;
  remember: any;
  returnId: any;
  salt: any;
  flag: number = 0;
  nrmlfa: boolean;
  quizData: any;
  resetfa: boolean;
  sIndex: string;
  strpub3: string;
  quizn1: any;
  quizn2: any;
  sCount: any;
  quizr1: any;
  quizr2: any;
  quizr3: any;
  quizr4: any;
  quizr5: any;
  quizr6: any;
  quizr7: any;
  quizr8: any;
  quizr9: any;
  quizr10: any;
  quizr11: any;
  quizr12: any;
  quizr13: any;
  quizr14: any;
  quizr15: any;
  quizr16: any;
  quizr17: any;
  quizr18: any;
  quizr19: any;
  quizr20: any;
  errorMsgBlk: boolean;
  errorMsg: boolean;
  save2fa: boolean;
  counter: number = 0;
  forgotemsg: string = "";
  password: string = 'password';
  saveAns: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    public formbuilder: FormBuilder,
    public odgenserv: ZebuodrGentrService,
    public zebuLoginService: ZebuLoginAPIService,
    public router: Router,
    private spinnerService: NgxUiLoaderService
  ) { }

  ngOnInit() {
    this.flag = 0;
    this.spinnerService.start();
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    var userspwd = atob(sessionStorage.getItem('rememberPwd'));
    var usersid = atob(sessionStorage.getItem('rememberUser'));
    var remValue = atob(sessionStorage.getItem('rememberToggle'));
    if (remValue && remValue != "ée") {
      this.zebulogin = this.formbuilder.group({
        userId: [usersid, [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
        password: [userspwd, [Validators.required, Validators.minLength(4)]],
        remember: [true],
      });
    } else {
      this.zebulogin = this.formbuilder.group({
        userId: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
        password: ['', [Validators.required, Validators.minLength(4)]],
        remember: [false],
      });
    }

    this.forgotPass = this.formbuilder.group({
      userId: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      pan: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]]
    });
    this.spinnerService.stop();

    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    this.zebufauthen = this.formbuilder.group({
      answer1: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[a-zA-Z0-9]+$')]],
      answer2: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]]
    });
    this.zebufauthenreset = this.formbuilder.group({
      answer0: ['', [Validators.required, Validators.minLength(1), Validators.pattern('^[a-zA-Z0-9]+$')]],
      answer1: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer2: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer3: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer4: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer5: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer6: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer7: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer8: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer9: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer10: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer11: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer12: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer13: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer14: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer15: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer16: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer17: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer18: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer19: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
      answer20: ['', [Validators.required, Validators.minLength(1), Validators.pattern("^[a-zA-Z0-9]+$")]],
    });
    this.zebufauthenreset.disable();
    this.spinnerService.start();
    // this.activatedRoute.queryParams.subscribe(data => {
    //   console.log(data)
    //   var decdata = JSON.parse(btoa(data.b3JkIjpud));
    //   console.log(decdata)
    //   this.resetquiz(decdata);
    //   console.log(data.returnUrl);
    //   console.log(this.quizData)
    // })

    // Reset Password
    this.passReset = this.formbuilder.group({
      confPass: ['', [Validators.required, Validators.minLength(4)]],
      oldPass: ['', [Validators.required, Validators.minLength(4)]],
      newPass: ['', [Validators.required, Validators.minLength(4)]],
    });
    // Unblock User
    this.unblock = this.formbuilder.group({
      userId: ['', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-Z0-9]+$')]],
      pan: ['', [Validators.required, Validators.minLength(4)]],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  zebuAccess(encyptKey) {
    this.spinnerService.start();
    this.zebulogin.value
    let json = {
      userId: this.zebulogin.value.userId,
      userData: encyptKey
    }
    this.zebuLoginService.encrpyUserLogin(JSON.stringify(json)).subscribe(data => {
      if (data['stat'] == "Ok") {
        var remuser = atob(sessionStorage.getItem('currentUser'));
        if (remuser != this.zebulogin.value.userId) {
          sessionStorage.clear();
          localStorage.clear();
        }
        if (this.zebulogin.value['remember']) {
          sessionStorage.setItem('rememberPwd', btoa(this.zebulogin.value.password));
          sessionStorage.setItem('rememberUser', btoa(this.zebulogin.value.userId));
          sessionStorage.setItem('rememberToggle', btoa(this.zebulogin.value.remember));
        }
        sessionStorage.setItem('currentUser', btoa(data['userId']));
        localStorage.setItem("currentUser", btoa(data['userId']));
        this.resetquiz(data)
      } else {
        this.notOKstat = data["emsg"];
        if (data['emsg'] == "User Blocked Contact System Administrator") {
          this.flag = 5;
        }
      }
      this.spinnerService.stop();
    }, (err) => {
      console.log("err", err)
      this.err = err.error;
      this.spinnerService.stop();
    }
    );
  }

  toggleForgetWindow() {
    if (this.showForget) {
      this.showForget = false;
    } else {
      this.showForget = true;
    }
  }

  resetPass() {
    this.spinnerService.start();
    this.zebuLoginService.forgotPass(this.forgotPass.value).subscribe((data) => {
      this.spinnerService.stop();
      if (data['stat'] == "Ok") {
        this.forgotemsg = "";
        this.flag = 0;
      } else if (data['stat'] == "Not_Ok") {
        this.forgotemsg = data["emsg"];
      }
    }, (err) => {
      this.spinnerService.stop();
    }
    );
  }

  goToForgetPassword() {
    this.zebulogin.value['userId'] = "";
    this.zebulogin.value['password'] = "";
    this.flag = 3;
  }

  backToLogin(flag) {
    this.zebulogin.value['userId'] = "";
    this.zebulogin.value['password'] = "";
    this.flag = flag;
    this.notOKstat = '';
  }

  getEncryptionKey() {
    let json = {
      userId: this.zebulogin.value.userId,
    }
    this.zebuLoginService.getEncryptKey(JSON.stringify(json)).subscribe((res) => {
      console.log(res)
      this.localPublicKey = res['encKey'];
      let encyptKey: any = CryptoJS.AES.encrypt(this.zebulogin.value.password, this.localPublicKey).toString();
      this.zebuAccess(encyptKey)
    }, (err) => {
      console.log(err.error)
    })
  }

  showHide() {
    if (this.password == "password") {
      this.password = "text";
    } else {
      this.password = "password";
    }
  }

  /**
  * from ngOnInit
  * @param decdata 
  */
  resetquiz(decdata) {
    console.log(decdata, "decdata");
    this.saveAns = decdata;
    if (decdata['sCount'] == "2") {
      this.sIndex = decdata['sIndex'];
      if (decdata['sQuestions'].indexOf('|')) {
        this.quizData = (decdata['sQuestions']).split("|");
      } else {
        this.quizData = (decdata['sQuestions']);
      }
      this.strpub3 = decdata['stringPkey3'];
      this.quizn1 = this.quizData[0];
      this.quizn2 = this.quizData[1];
      this.sCount = decdata['sCount'];
      this.flag = 1;
    } else {
      this.sIndex = decdata['sIndex'];
      this.strpub3 = decdata['stringPkey3'];
      // console.log(decdata['sQuestions'].indexOf('|'))
      if (decdata['sQuestions'].indexOf('|')) {
        this.quizData = (decdata['sQuestions']).split("|");
      } else {
        this.quizData = (decdata['sQuestions']);
      }
      this.quizr1 = this.quizData[0];
      this.quizr2 = this.quizData[1];
      this.quizr3 = this.quizData[2];
      this.quizr4 = this.quizData[3];
      this.quizr5 = this.quizData[4];

      this.quizr6 = this.quizData[5];
      this.quizr7 = this.quizData[6];
      this.quizr8 = this.quizData[7];
      this.quizr9 = this.quizData[8];
      this.quizr10 = this.quizData[9];

      this.quizr11 = this.quizData[10];
      this.quizr12 = this.quizData[11];
      this.quizr13 = this.quizData[12];
      this.quizr14 = this.quizData[13];
      this.quizr15 = this.quizData[14];

      this.quizr16 = this.quizData[15];
      this.quizr17 = this.quizData[16];
      this.quizr18 = this.quizData[17];
      this.quizr19 = this.quizData[18];
      this.quizr20 = this.quizData[19];
      this.flag = 2;
    }
    this.spinnerService.stop();
  }

  zebu2fa(state) {
    this.spinnerService.start();
    if (state == "normal") {
      this.zebufauthen.value["userId"] = this.odgenserv.getUserId();
      this.zebufauthen.value["sCount"] = this.sCount;
      this.zebufauthen.value["sIndex"] = this.sIndex;
      let zebunrml = this.zebufauthen.value;
      this.zebu2faAjax(zebunrml); // ajax call function
    } else {
      let zebufareset = this.zebufauthenreset.value
      this.zebu2fsave(zebufareset); // ajax call function
    }
  }

  // ajax call function
  zebu2faAjax(data) {
    this.zebuLoginService.zebuvalidate2fa(data).subscribe(respdata => {
      if (respdata['stat'] == "Ok") {
        this.zebufauthen.value['answer1'] = "";
        this.zebufauthen.value['answer2'] = "";
        localStorage.setItem('sessionToken2', btoa(JSON.stringify(respdata['userSettingDto'])));
        if (this.returnUrl != '/') {
          this.router.navigateByUrl(this.returnUrl); //while redirection it will go to this page
        } else {
          if (respdata['sPasswordReset'] == 'Y') {
            this.flag = 4;
          } else {
            this.router.navigateByUrl('home');//Normal Login it will go to this page
          }
        }
      } else if (respdata['stat'] == "Not_Ok" && respdata['emsg'] == "User Blocked Contact System Administrator") {
        this.zebufauthen.value['answer1'] = "";
        this.zebufauthen.value['answer2'] = "";
        this.errorMsgBlk = true;
        this.flag = 5;
      } else {
        this.resetquiz(respdata);
        this.errorMsg = true;
      }
      this.spinnerService.stop();
    }, (err) => {
      this.err = err.error;
      this.spinnerService.stop();
    })
  }

  zebu2fsave(saveans) {
    var qIndex = this.saveAns['sIndex'];
    var questions = qIndex.split('|');
    let list, qa = "";

    for (var k = 0; k < 20; k++) {
      if (saveans['answer' + k] != undefined) {
        list = questions[k] + '|' + saveans['answer' + k];
        qa = qa + list + "|";
      }
    }

    var jsonObj = {
      "userId": this.odgenserv.getUserId(),
      "ques_Ans": qa.slice(0, -1)
    }
    this.odgenserv.zebuReset2fa(jsonObj).subscribe(respdata => {
      console.log(respdata)
      if (respdata['stat'] == "Ok") {
        this.save2fa = true;
        setTimeout(data => {
          // this.router.navigateByUrl('login');
          this.flag = 0;
        }, 2000)
      }
      this.spinnerService.stop();
    }, (err) => {
      console.log("err", err)
      this.err = err.error;
      this.spinnerService.stop();
    })
  }

  checkBox(e) {
    if (e.checked === true) {
      if (this.counter < 5) {
        this.counter++;
        this.zebufauthenreset.controls[(e.source.name).slice(0, -1)].enable();
      } else {
        e.checked = false;
      }
    } else if (this.counter > 0) {
      this.counter--;
      this.zebufauthenreset.controls[(e.source.name).slice(0, -1)].disable();
    }
  }

  // Method to Reset Password
  resetNow() {
    let obj = this.passReset.value;
    if (obj.newPass == obj.confPass) {
      this.notOKstat = null;
      let jsonObj = {
        "oldPassword": obj.oldPass,
        "newPassword": obj.newPass,
        "preLogin": 'Y',
        "userId": this.odgenserv.getUserId(),
        "userSessionID": this.odgenserv.getSessionToken()
      }
      this.spinnerService.start();
      this.odgenserv.resetPasswordPreLogin(jsonObj).subscribe(data => {
        if (data['stat'] == "Ok") {
          var b3JkIjpud = btoa(JSON.stringify(data));
          var returnUrl = btoa(this.returnUrl);
          this.flag = 0;
        } else {
          this.notOKstat = data["emsg"];
        }
        this.spinnerService.stop();
      }, (err) => {
        // console.log("err", err)
        this.err = err.error;
        this.spinnerService.stop();
      }
      );
    } else {
      this.notOKstat = "Password did not matched";
    }
  }

  // Unblock User
  unblockUser() {
    this.spinnerService.start();
    this.zebuLoginService.unblockUser(this.unblock.value).subscribe(data => {
      if (data['stat'] == "Ok") {
        // var b3JkIjpud = btoa(JSON.stringify(data));
        // var returnUrl = btoa(this.returnUrl);
        // this.router.navigate(["/login"], { queryParams: { b3JkIjpud, returnUrl } });
        this.flag = 0;
      } else {
        this.notOKstat = data["emsg"];
      }
      this.spinnerService.stop();
    }, (err) => {
      // console.log("err", err)
      this.err = err.error;
      this.spinnerService.stop();
      if (err == "Unauthorized") {
        this.flag = 0;
      }
    });
  }

  /**
   * Unlock User
   * @
   */
  goToUnblockUser() {
    this.notOKstat = "";
    this.flag = 5;
    this.zebulogin.value['userId'] = "";
    this.zebulogin.value['password'] = "";
  }

  /**
   * Reset Password 
   */
  goToResetPassword() {
    this.zebulogin.value['userId'] = "";
    this.zebulogin.value['password'] = "";
    this.flag = 3;
  }
}