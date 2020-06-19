import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as CryptoJS from 'crypto-js';

/* Root services */
import { ZebuodrGentrService } from '../../services/zebuodr-gentr.service';

/* Feature module */
import { ZebuLoginServiceModule } from './zebu-login-service.module';

const ErrorConstant: any = {
  INTERNAL_ERROR: "Error in the system. Sorry for the trouble. Please call customer care to solve your issue.",
  MIS_MATCHED_CREDENTIALS: "Email address/Password is wrong.",
  BLOCKED_USER: "User Blocked Contact System Administrator",
}

/**
 * we declare that this service should be created
 * by any injector that includes ZebuLoginModule.
 */
@Injectable({
  providedIn: ZebuLoginServiceModule,
})
export class ZebuLoginService {

  /* Error confirmation and its message */
  isError: Boolean = false;
  errorMsg: string = "";
  /* To enable progress bar */
  isLoading: Boolean = false;
  /* Indicates user is authenticated and can move to challenge route */
  isAuthenticatedUser = new BehaviorSubject<Boolean>(false);
  challengeQuestions: string[] = [];

  constructor(
    private odgenserv: ZebuodrGentrService
  ) {
    console.warn( "Superstar construction" );
  }

  /**
   * initChallengeQuestion will initialise challenge questions
   * based upon response.
   **/
  initChallengeQuestion(question: string) {
    this.challengeQuestions = question.split("|");
  }

  zebuAccess(
    userInfo: {
      userID: string,
      password: string,
      isRemembered: boolean
    },
    encyptKey: string
  ) {
    let json = {
      userId: userInfo.userID,
      userData: encyptKey
    }
    /**
     * Send userID along with encrypted password for authentication
     */
    this.odgenserv.encrpyUserLogin(
      JSON.stringify(json)
    ).subscribe(data => {
      console.warn( "Response data: ", data );
      if (data['stat'] === "Ok") {
        const remuser = atob(sessionStorage.getItem('currentUser'));
        if (remuser != userInfo.userID) {
          sessionStorage.clear();
          localStorage.clear();
        }
        if (userInfo.isRemembered) {
          sessionStorage.setItem('rememberPwd', btoa(userInfo.password));
          sessionStorage.setItem('rememberUser', btoa(userInfo.userID));
        }
        sessionStorage.setItem('currentUser', btoa(data['userId']));
        localStorage.setItem("currentUser", btoa(data['userId']));
        /* Initialising challenge questions with response data */
        this.initChallengeQuestion(data['sQuestions']);
        this.isAuthenticatedUser.next(true);
      } else {
        /* TODO: Confirm what are all the kinds of error comes here. */
        console.warn( "Response error" );
        this.isError = true;
        if (data['emsg'] === ErrorConstant.BLOCKED_USER ) {
          this.errorMsg = ErrorConstant.BLOCKED_USER
        } else {
          this.errorMsg = ErrorConstant.MIS_MATCHED_CREDENTIALS
        }
        /* Disabling progress bar upon error*/
        this.disableProgressBar();
      }
      console.warn( "Superstar Ended" );
    }, (err) => {
      /* TODO: Handle error */
      console.warn("err", err)
      this.isError = true;
      this.errorMsg = ErrorConstant.INTERNAL_ERROR;
      console.warn( "Superstar Error" );

      /* Disabling progress bar upon error*/
      this.disableProgressBar();
    } );
    console.warn( "Superstar Final" );
  }

  /**
   * Make request to server to authenticate an user
   */
  authenticateUser(userInfo: {
    userID: string,
    password: string,
    isRemembered: boolean
  }) {
    console.warn( "Authenticating user" );
    /* Enabling progress bar */
    this.enableProgressBar();
    this.isAuthenticatedUser.next(false);
    /**
     * Collecting public key to encrypt password before sending in request
     */
    this.odgenserv.getEncryptKey(
      JSON.stringify({ userId: userInfo.userID })
    ).subscribe((res) => {
      console.warn( res )
      /* Encrypting password with public key and convert it to string*/
      let encyptKey: string = CryptoJS.AES.encrypt(
        userInfo.password,
        res['encKey']
      ).toString();
      /* Sending request to validate credentials */
      this.zebuAccess(userInfo, encyptKey)
      console.warn( "Superstar success" );
    }, (err) => {
      /* TODO: Display error message to an user */
      console.warn( err.error )
      this.isError = true;
      this.errorMsg = ErrorConstant.INTERNAL_ERROR;

      /* Disabling progress bar upon error*/
      this.disableProgressBar();
    })
    console.warn( "Superstar Duck" );
  }

  /**
   * Make request to server to validate security answers
   * submitted by an user after authenticating in the system
   */
  validateSecurityQuestions() {
    console.log( "validating security questions" );
  }

  /**
   * Make request to server to reset user's password as they
   * forgot password.
   */
  forgotPassword() {
    console.log( "Reset user's password with forgot password API" );
  }

  /**
   * Make request to server to unblock an user as they blocked
   * due to some reason.
   */
  unblockUser(userInfo: object) {
    console.warn( "Unblock user" );
    this.enableProgressBar();
    this.odgenserv.forgotPass(userInfo).subscribe(
      (data) => {
        this.disableProgressBar();
        console.warn( data );
        if(data['stat'] == "Ok"){
          // TODO: Handle success message
          // this.forgotemsg = "";
          // this.flag = 0;
        }else if(data['stat'] == "Not_Ok"){
          // TODO: Handle error
          // this.forgotemsg = data["emsg"];
        }
      },
      (err) => {
        this.disableProgressBar();
      }
    );
  }

  enableProgressBar() {
    this.isLoading = true;
  }

  disableProgressBar() {
    this.isLoading = false;
  }
}
