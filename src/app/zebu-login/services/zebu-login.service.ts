import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AES } from 'crypto-js';

/* Root services */
import { ZebuodrGentrService } from '../../services/zebuodr-gentr.service';

/* Feature module */
import { ZebuLoginServiceModule } from './zebu-login-service.module';

/* Feature Model */
import { ErrorModel } from "./models/Error";
import { STORAGE_VARIABLEs } from "./models/Localstorage";
import { LoginModel } from "./models/Login";

const ErrorConstant: any = {
  BLOCKED_USER: "User Blocked Contact System Administrator",
  INTERNAL_ERROR: "Error in the system. Sorry for the trouble. Please call customer care to solve your issue.",
  INVALID_USER_ID: "Submit valid UserID!",
  INVALID_USER_ID_OR_PASSWORD: "Invalid UserID/Password!",
  MIS_MATCHED_CREDENTIALS: "Email address/Password is wrong.",
};

const ResponseStatus: any = {
  VALID_STATUS: "Ok",
  IN_VALID_STATUS: "Not_Ok",
}

const COLLECT_SECURITY_TYPEs: any = {
  DEFAULT: "",
  PASSWORD: "PASSWORD",
  MPIN: "MPIN",
};

const CHALLENGE_RESPONSE: any = {
  DEFAULT: "",
  RESET_AND_HOME: "RESET_AND_HOME",
  HOME: "HOME"
}

/**
 * we declare that this service should be created
 * by any injector that includes ZebuLoginModule.
 */
@Injectable({
  providedIn: ZebuLoginServiceModule,
})
class ZebuLoginService {

  /* Error confirmation and its message */
  errorData: ErrorModel = {
    IsError: false,
  };
  /* To enable progress bar */
  isLoading = new BehaviorSubject<Boolean>(false);
  /* Indicates user is authenticated and can move to challenge route */
  isAuthenticatedUser = new BehaviorSubject<Boolean>(false);
  /* Indicates user is already logged in the system or not */
  collectSecurityState = new BehaviorSubject<string>(COLLECT_SECURITY_TYPEs.DEFAULT);
  /* Indicates user has to go home or reset passsword and then to home */
  challengeNavigationState = new BehaviorSubject<string>(
    CHALLENGE_RESPONSE.DEFAULT
  );
  challengeQuestions: string[] = [];
  publicKey: string = "";
  loginData: LoginModel = {
    IsAlreadyLoggedIn: false,
  };

  constructor(
    private odgenserv: ZebuodrGentrService
  ) { }

  /**
   * Login: Phase 1 => Submitting identifier
   * Upon submission, it has to process either one of following,
   * 1) Move to password validation if user is logging for the first time
   * 2) Move to MPIN validation if they already logged in and created MPIN
   * */
  submitIdentifier(userID: string) {
    /* Enabling progress bar */
    this.enableProgressBar();
    this.loginData.UserID = userID;
    /**
     * Collecting public key to encrypt password before sending in request.
     * Sending request to backend to collect whether user is already logged in 
     * or the account is newly logging into the system
     */
    this.odgenserv.getUserLoggedInStatus(
      JSON.stringify({ userId: userID })
    ).subscribe((res) => {
      console.warn(res);
      if (res) {
        /* Invalid user which is not present in DB */
        if (!res.available) {
          this.errorData.IsError = true;
          this.errorData.ErrorMsg = ErrorConstant.INVALID_USER_ID;
          /* Disabling progress bar upon error*/
          this.disableProgressBar();
          return;
        }

        /* Updating response to login data */
        this.loginData.IsAlreadyLoggedIn = res.login
        if (res.login) {
          this.collectSecurityState.next(COLLECT_SECURITY_TYPEs.MPIN);
        } else {
          this.collectSecurityState.next(COLLECT_SECURITY_TYPEs.PASSWORD);
        }
      }
    }, (err) => {
      /* TODO: Handle internet connection error */
      console.warn(err.error)
      this.errorData.IsError = true;
      this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      /* Disabling progress bar upon error */
      this.disableProgressBar();
    })
  }


  /**
   * Login: Phase 2 => Option 1 => Submitting password 
   * When password is submitted and it is valid then collect
   * two factor authentication Q&A. If it is wrong then print error
   * message to an user
   * */
  validatePasswordAuthentication(userInfo: {
    userId: string,
    password: string,
    isRemembered: boolean
  }) {
    this.authenticateUser(userInfo);
  }

  /**
   * Login: Phase 3 => Submitting two factor authentication 
   * Collect answers from user and send it to server for validation.
   * If answers are valid and then we collet MPIN from user
   * for further logins in other devices.
   * */
  validateTwoFactorAuthentication(
    answers: string[],
    userID: string,
  ) {
    const data = {
      "answer1": answers[0],
      "answer2": answers[1],
      "userId": userID,
      /* TODO: Replace the defaults */
      "sCount": "2",
      "sIndex": "45|17"
    };
    this.odgenserv.zebuvalidate2fa(data).subscribe(respdata => {
      /**
       * If all good then we storing sessionToken and moving to
       * home page or respection page as per our response
       **/
      if (respdata['stat'] == ResponseStatus.VALID_STATUS) {
        localStorage.setItem(
          STORAGE_VARIABLEs.SESSION_TOKEN,
          btoa(JSON.stringify(respdata['userSettingDto']))
        );
        /* TODO: Learn about this code section */
        // if (this.returnUrl != '/') {
        //   this.router.navigateByUrl(this.returnUrl); //while redirection it will go to this page
        // return;
        // }
        /* TODO: Get confirmation from raghu. Currently, its not present
         * in new screen.
         **/
        /**
         * If we got response with password reset then we're navigating to password
         * reset section page. Else moving straight to home page.
         * */
        // if (respdata['sPasswordReset'] == 'Y') {
        //   this.challengeNavigationState.next(CHALLENGE_RESPONSE.RESET_AND_HOME);
        //   return;
        // }

        this.challengeNavigationState.next(CHALLENGE_RESPONSE.HOME);
        return;
      }

      /* If status is IN_VALID then we marking it as an error */
      if (
        respdata['stat'] == ResponseStatus.IN_VALID_STATUS
        && respdata['emsg'] == "User Blocked Contact System Administrator"
      ) {
        /* TODO: If user blocked then previous security screen shouldn't pass */
        this.errorData.IsError = true;
        this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
        this.disableProgressBar();
        return;
      }

      /* If any other status comes then we're marking it as an internal error */
      this.errorData.IsError = true;
      this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      this.disableProgressBar();
    }, (err) => {

      /* Handling any error response code from server */
      this.errorData.IsError = true;
      this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      this.disableProgressBar();
    })
  }

  /**
   * Login: Phase 3 => Option 1 => User are forced to reset their password
   * when the defined conditions match as per requirment. This screen will comes
   * live when conditions matches to the logging user.
   * @param newPassword NewPassword that has to update for the UserID
   */
  resetPassword(newPassword: string) {

  }

  /**
   * Login: Phase 4 => Creating MPin to support other devices during their login
   * This system enables once user is successfully logged into the system
   * */
  submitNewMPin(mpin: string) {

  }

  /**
   * Login: Phase 2 => Option 2 => Submitting MPin for validation 
   * If an user is logged into a system and once again they tries
   * to login using other devices with the same account, then we're 
   * validating mpin instead of password.
   * */
  validateMPinAuthentication(userInfo: {
    userID: string,
    mpin: string,
    isRemembered: boolean
  }) {

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
      userId: string,
      password: string,
      isRemembered: boolean
    },
    encyptKey: string
  ) {
    let json = {
      userId: userInfo.userId,
      userData: encyptKey
    }
    /**
     * Send userID along with encrypted password for authentication
     */
    this.odgenserv.encrpyUserLogin(
      JSON.stringify(json)
    ).subscribe(data => {
      if (data['stat'] === ResponseStatus.VALID_STATUS) {
        const remuser = atob(sessionStorage.getItem('currentUser'));
        if (remuser != userInfo.userId) {
          sessionStorage.clear();
          localStorage.clear();
        }
        if (userInfo.isRemembered) {
          sessionStorage.setItem('rememberPwd', btoa(userInfo.password));
          sessionStorage.setItem('rememberUser', btoa(userInfo.userId));
        }
        sessionStorage.setItem('currentUser', btoa(data['userId']));
        localStorage.setItem("currentUser", btoa(data['userId']));
        /* Initialising challenge questions with response data */
        this.initChallengeQuestion(data['sQuestions']);
        this.isAuthenticatedUser.next(true);
      } else {
        /* TODO: Confirm what are all the kinds of error comes here. */
        console.warn("Response error");
        this.errorData.IsError = true;
        if (data['emsg'] === ErrorConstant.BLOCKED_USER) {
          this.errorData.ErrorMsg = ErrorConstant.BLOCKED_USER
        } else {
          this.errorData.ErrorMsg = ErrorConstant.MIS_MATCHED_CREDENTIALS
        }
        /* Disabling progress bar upon error*/
        this.disableProgressBar();
      }
      console.warn("Superstar Ended");
    }, (err) => {
      /* TODO: Handle error internet connection or place common message */
      console.warn("err", err)
      this.errorData.IsError = true;
      this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      /* Disabling progress bar upon error*/
      this.disableProgressBar();
    });
  }

  /**
   * Make request to server to authenticate an user
   */
  authenticateUser(userInfo: {
    userId: string,
    password: string,
    isRemembered: boolean
  }) {
    this.isAuthenticatedUser.next(false);
    /**
     * Collecting public key to encrypt password before sending in request
     */
    this.odgenserv.getEncryptKey(
      JSON.stringify({ userId: userInfo.userId })
    ).subscribe((res) => {
      /* Encrypting password with public key and convert it to string*/
      let encyptKey: string = AES.encrypt(
        userInfo.password,
        res['encKey']
      ).toString();
      /* Sending request to validate credentials with encryption */
      this.zebuAccess(userInfo, encyptKey)
    }, (err) => {
      /* TODO: Validate internet connection error or place unique error message */
      this.errorData.IsError = true;
      this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      /* Disabling progress bar upon error*/
      this.disableProgressBar();
    })
    console.warn("Superstar Duck");
  }

  /**
   * Make request to server to unblock an user as they blocked
   * due to some reason.
   */
  unblockUser(userInfo: object) {
    this.odgenserv.forgotPass(userInfo).subscribe(
      (data) => {
        /* Disabling progress bar upon receiving response*/
        this.disableProgressBar();
        if (data['stat'] === ResponseStatus.VALID_STATUS) {
          // TODO: Handle success message
          // this.forgotemsg = "";
          // this.flag = 0;
        } else if (data['stat'] === ResponseStatus.IN_VALID_STATUS) {
          /* TODO: Validate internet connection error or place unique error message */
          this.errorData.IsError = true;
          this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
        }
      },
      (err) => {
        this.disableProgressBar();
        /* TODO: Validate internet connection error or place unique error message */
        this.errorData.IsError = true;
        this.errorData.ErrorMsg = ErrorConstant.INTERNAL_ERROR;
      }
    );
  }

  /* Getter and setter kind of methods */
  setCollectSecurityState(option: string) {
    this.collectSecurityState.next(option);
  }

  enableProgressBar() {
    this.isLoading.next(true);
  }

  disableProgressBar() {
    this.isLoading.next(false);
  }
}

export {
  ZebuLoginService,
  COLLECT_SECURITY_TYPEs,
  CHALLENGE_RESPONSE
};
