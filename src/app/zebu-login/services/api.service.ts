import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/* Root services */
import { ZebuodrGentrService } from '@app/services/zebuodr-gentr.service';
/* Feature module */
import { ZebuLoginServiceModule } from './zebu-login-service.module';
import { CreateMPinModel } from "@zebu-login/models/request/mpin";
import { ResetPasswordModel } from "@zebu-login/models/request/Reset";

@Injectable({
  providedIn: ZebuLoginServiceModule,
})
export class ApiService {

  baseURL: string = "https://www.zebull.in/rest/MobullService/v2/";
  /* API endpoints */
  customerLoginStatusEndpoint: string = "customer/getUserLoggedInStatus";
  customerKey: string = "customer/getEncryptionKey";
  encptLogin: string = "customer/webLogin";
  validate2fa: string = "customer/validAnswer";
  createMPIN: string = "customer/createMpin";
  updateMPIN: string = "customer/updateMpin";
  verifyMPIN: string = "customer/verifyMpin";
  unblock: string = "customer/unblockUser";
  forgetPass: string = "customer/forgotPassword";

  constructor(
    public http: HttpClient,
    private odgenserv: ZebuodrGentrService
  ) { }

  getUserLoggedInStatus(jsonObj: any): Observable<any> {
    return this.http.post(
      this.baseURL + this.customerLoginStatusEndpoint,
      jsonObj, // JSON body
      {
        headers: this.odgenserv.getAuthHeaders(),
      }
    );
  }


  getEncryptKey(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.customerKey, jsonObj, {
      headers: this.odgenserv.getAuthHeaders(),
    })
  }

  encrpyUserLogin(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.encptLogin, jsonObj, {
      headers: this.odgenserv.getAuthHeaders(),
    })
  }

  zebuvalidate2fa(jsonObj): Observable<any> {
    return this.http.post(this.baseURL + this.validate2fa, jsonObj, {
      headers: this.odgenserv.headers
    }).pipe(map(user => {
      if (user['userSessionID']) {
        localStorage.setItem("currentUser", btoa(user['userId']));
        localStorage.setItem("tokenId", user['userSessionID']);
      }
      return user;
    }))
  }

  unblockUser(jsonObj) {
    return this.http.post(this.baseURL + this.unblock, jsonObj, {
      headers: this.odgenserv.headers
    }).pipe(map(user => {
      if (user['stat'] == "Ok") {
        localStorage.setItem("currentUser", btoa(user['userId']));
        var lastclear = localStorage.getItem('tStamp');
        var time_now = ((new Date()).getTime()).toString();
        localStorage.setItem("tStamp", time_now);
        if ((parseInt(time_now) - parseInt(lastclear)) > 1000 * 60 * 60 * 24) {
          localStorage.clear();
          localStorage.setItem('tStamp', time_now);
        }
      }
      return user;
    }))
  }

  forgotPass(jsonObj: ResetPasswordModel): Observable<any> {
    return this.http.post(this.baseURL + this.forgetPass, jsonObj, {
      headers: this.odgenserv.headers
    })
  }

  createNewMPIN(jsonObject: CreateMPinModel): Observable<any> {
    return this.http.post(this.baseURL + this.createMPIN, jsonObject, {
      headers: this.odgenserv.getAuthHeaders(),
    });
  }

  authenticateUserWithMPin(jsonObject: CreateMPinModel): Observable<any> {
    return this.http.post(this.baseURL + this.verifyMPIN, jsonObject, {
      headers: this.odgenserv.getAuthHeaders(),
    });
  }
}
