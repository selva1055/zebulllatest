import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ZebuodrGentrService } from '../services/zebuodr-gentr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-zebu-fauthen',
  templateUrl: './zebu-fauthen.component.html',
  styleUrls: ['./zebu-fauthen.component.scss']
})
export class ZebuFauthenComponent implements OnInit {
  public err: any;
  public zebufauthen: FormGroup;
  public zebufauthenreset: FormGroup;
  quizData: any;
  nrmlfa: boolean;
  resetfa: boolean;
  quizn1: any;
  quizn2: any;
  quizr1: any;
  quizr2: any;
  quizr3: any;
  quizr4: any;
  quizr5: any;
  strpub3: string;
  sIndex: string;
  sCount: any;
  returnUrl: any;
  errorMsg: boolean;
  saveAns: any;
  errorMsgBlk: boolean;
  errorConnection: boolean;
  save2fa: boolean;
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
  counter: number = 0;

  constructor(public formbuilder: FormBuilder,
    public actroute: ActivatedRoute,
    public odgenserv: ZebuodrGentrService,
    public routeTo: Router,
    private spinnerService: NgxUiLoaderService) {

  }

  ngOnInit() {
    this.returnUrl = this.actroute.snapshot.queryParams['returnUrl'] || '/';
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
    this.actroute.queryParams.subscribe(data => {
      var decdata = JSON.parse(atob(data.b3JkIjpud));
      this.resetquiz(decdata);
    })
  }

  /**
   * from ngOnInit
   * @param decdata 
   */
  resetquiz(decdata) {
    this.saveAns = decdata;
    if (decdata['sCount'] == "2") {
      this.nrmlfa = false;
      this.resetfa = true;
      this.sIndex = decdata['sIndex'];
      if (decdata['sQuestions'].indexOf('|')) {
        this.quizData = (decdata['sQuestions']).split("|");
      } else {
        this.quizData = (decdata['sQuestions']);
      }
      this.strpub3 = decdata['stringPkey3'];
      this.quizn1 = this.quizData[0];
      this.quizn2 = this.quizData[1];
      this.sCount = decdata['sCount']
    } else {
      this.resetfa = false;
      this.nrmlfa = true;
      this.sIndex = decdata['sIndex'];
      this.strpub3 = decdata['stringPkey3'];
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
    this.odgenserv.zebuvalidate2fa(data).subscribe(respdata => {
      if (respdata['stat'] == "Ok") {
        localStorage.setItem('sessionToken2', btoa(JSON.stringify(respdata['userSettingDto'])));
        this.returnUrl = atob(this.actroute.snapshot.queryParams['returnUrl']) || '/';
        var b3JkIjpud = btoa(JSON.stringify(data));
        var returnUrl = btoa(this.returnUrl);
        if (this.returnUrl != '/') {
          this.routeTo.navigateByUrl(this.returnUrl); //while redirection it will go to this page
        } else {
          if (respdata['sPasswordReset'] == 'Y') {
            this.routeTo.navigateByUrl("passReset");
          } else {
            this.routeTo.navigateByUrl('home');//Normal Login it will go to this page
          }
        }
      } else if (respdata['stat'] == "Not_Ok" && respdata['emsg'] == "User Blocked Contact System Administrator") {
        this.spinnerService.stop();
        this.errorMsgBlk = true;
        this.errorConnection = false;
        this.routeTo.navigate(["/unblock"], { queryParams: { b3JkIjpud, returnUrl } });
      } else if(respdata['stat'] == "Not_Ok" && respdata['emsg'] == "Connection Failed.Please try again later"){
        this.spinnerService.stop();
        this.errorConnection = true;
        this.errorMsgBlk = false;
      }else{
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
      if (respdata['stat'] == "Ok") {
        this.save2fa = true;
        setTimeout(data => {
          this.routeTo.navigateByUrl('login');
        }, 2000)
      }
      this.spinnerService.stop();
    }, (err) => {
      this.err = err.error;
      this.spinnerService.stop();
    })
  }

  checkBox(e) {
    let seledItem = 0;
    if (e.target.checked === true) {
      if (this.counter < 5) {
        this.counter++;
        this.zebufauthenreset.controls[(e.target.name).slice(0, -1)].enable();
      } else {
        e.target.checked = false;
      }
    } else if (this.counter > 0) {
      this.counter--;
      this.zebufauthenreset.controls[(e.target.name).slice(0, -1)].disable();
    }
  }
}
