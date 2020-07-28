import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AES } from 'crypto-js';

/* Feature module */
import { ZebuLoginServiceModule } from './zebu-login-service.module';
import { ApiService as ZebuLoginAPIService } from "./api.service";

/* Feature Model */
import { ErrorConstant, ErrorModel } from "@zebu-login/models/Error";
import { STORAGE_VARIABLEs } from "@zebu-login/models/Localstorage";
import { LoginModel } from "@zebu-login/models/Login";
import {
  LOGIN_STATE
} from "@zebu-login/models/Navigation";
import { ResponseStatus } from "@zebu-login/models/Response";
import { ResetPasswordModel } from "@zebu-login/models/request/Reset";

/**
 * we declare that this service should be created
 * by any injector that includes ZebuLoginModule.
 */
@Injectable({
  providedIn: ZebuLoginServiceModule,
})
class ZebuLoginService {

  /* Error confirmation and its message */
  static errorState = new BehaviorSubject<ErrorModel>({
    IsError: false,
  });
  /* To enable progress bar */
  static isLoading = new BehaviorSubject<Boolean>(false);
  /* Handle which state login module has to work */
  static zebuLoginState = new BehaviorSubject<string>(
    LOGIN_STATE.DEFAULT
  );
  challengeQuestions: string[] = [];
  static loginData: LoginModel = {
    UserID: "",
    IsAlreadyLoggedIn: false,
    IsMPINAvailable: false,
  };

  constructor(
    private zebuLoginAPIService: ZebuLoginAPIService,
  ) { }

  /**
   * Login: Phase 1 => Submitting identifier
   * Upon submission, it has to process either one of following,
   * 1) Move to password validation if user is logging for the first time
   * 2) Move to MPIN validation if they already logged in and created MPIN
   * */
  submitIdentifier(userID: string) {
    /**
     * Collecting public key to encrypt password before sending in request.
     * Sending request to backend to collect whether user is already logged in 
     * or the account is newly logging into the system
     */
    this.zebuLoginAPIService.getUserLoggedInStatus(
      JSON.stringify({ userId: userID })
    ).subscribe((res) => {
      const { stat, available, login } = res;
      /* TODO: Confirm with gowri about its valid status */
      // if (stat === ResponseStatus.VALID_STATUS) {
      /* Updating loginData upon success */
      ZebuLoginService.loginData = {
        UserID: userID,
        IsMPINAvailable: available,
        IsAlreadyLoggedIn: login,
      };

      /* Updating response to login data */
      if (login) {
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.MPIN_SECTION);
      } else {
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.PASSWORD_SECTION);
      }
      // } else {
      //   /* TODO: Handle invalid */
      // }
    }, (err) => {
      ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
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
    /* Validating answers length as we using numerical index*/
    if (answers && answers.length !== 2) {
      return
    }
    this.zebuLoginAPIService.zebuvalidate2fa({
      "answer1": answers[0],
      "answer2": answers[1],
      "userId": userID,
      "sCount": ZebuLoginService.loginData.TwoFactor.sCount,
      "sIndex": ZebuLoginService.loginData.TwoFactor.sIndex,
    }).subscribe(respdata => {
      /**
       * If all good then we storing sessionToken and moving to
       * home page or respection page as per our response
       **/
      if (respdata['stat'] == ResponseStatus.VALID_STATUS) {
        localStorage.setItem(
          STORAGE_VARIABLEs.SESSION_TOKEN,
          btoa(JSON.stringify(respdata['userSettingDto']))
        );
        /* TODO: Get confirmation from raghu. Currently, its not present
         * in new screen.
         **/
        /**
         * If we got response with password reset then we're navigating to password
         * reset section page.
         * */
        if (respdata['sPasswordReset'] === 'Y') {
          /**
           * IF MPin is available then renew password => home
           * else renew password => set mpin => home
           * */
          ZebuLoginService.zebuLoginState.next(
            ZebuLoginService.loginData.IsMPINAvailable
              ? LOGIN_STATE.RENEW_AND_HOME
              : LOGIN_STATE.RENEW_AND_MPIN
          );
          return;
        }
        /**
         * If MPIN is available then moving straight to home
         * Else we collect MPIN and then move to home
         */
        ZebuLoginService.zebuLoginState.next(
          ZebuLoginService.loginData.IsMPINAvailable
            ? LOGIN_STATE.HOME
            : LOGIN_STATE.MPIN_AND_HOME
        );
        return;
      }

      /* If status is IN_VALID then we marking it as an error */
      if (
        respdata['stat'] == ResponseStatus.IN_VALID_STATUS
        && respdata['emsg'] == "User Blocked Contact System Administrator"
      ) {
        /* TODO: If user blocked then previous security screen shouldn't pass */
        ZebuLoginService.setErrorState(true, respdata['emsg']);
        return;
      }

      /* If any other status comes then we're marking it as an internal error */
      ZebuLoginService.setErrorState(true, ErrorConstant.respdata['emsg']);
    }, (err) => {
      ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
    })
  }

  /**
   * Login: Phase 4 => Creating MPin to support other devices during their login
   * This system enables once user is successfully logged into the system
   * */
  submitNewMPin(mpin: string) {
    this.zebuLoginAPIService.createNewMPIN({
      mpin,
      userId: ZebuLoginService.loginData.UserID
    }).subscribe(
      (response) => {
        if (response['stat'] === ResponseStatus.VALID_STATUS) {
          ZebuLoginService.zebuLoginState.next(LOGIN_STATE.HOME);
          return;
        }

        /* TODO: Handle error internet connection or place common message */
        ZebuLoginService.setErrorState(true, ErrorConstant.response['emsg']);
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.SUBMISSION_ERROR);

      },
      (error) => {
        ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
      }
    );
  }

  /**
   * Login: Phase 2 => Option 2 => Submitting MPin for validation 
   * If an user is logged into a system and once again they tries
   * to login using other devices with the same account, then we're 
   * validating mpin instead of password.
   * */
  validateMPin(
    userID: string,
    mpin: string,
  ) {
    this.zebuLoginAPIService.authenticateUserWithMPin({
      userId: userID, mpin: mpin
    }).subscribe(
      (response) => {
        if (response['stat'] === ResponseStatus.VALID_STATUS) {
          /* Clear if any existing storage values */
          sessionStorage.clear();
          localStorage.clear();
          /* Configuring storage values */
          sessionStorage.setItem('currentUser', btoa(userID));
          localStorage.setItem("currentUser", btoa(userID));
          localStorage.setItem("tokenId", response['userSessionID']);
          localStorage.setItem(
            STORAGE_VARIABLEs.SESSION_TOKEN,
            btoa(JSON.stringify(response['userSettingDto']))
          );
          /* TODO: Get confirmation from raghu. Currently, its not present
           * in new screen.
           **/
          /**
           * If we got response with password reset then we're navigating to password
           * reset section page.
           * */
          if (response['sPasswordReset'] === 'Y') {
            /**
             * IF user has to renew their password
             * then renew password => home
             * */
            ZebuLoginService.zebuLoginState.next(
              LOGIN_STATE.RENEW_AND_HOME
            );
            return;
          }
          /**
           * IF all good then moving straight to home
           */
          ZebuLoginService.zebuLoginState.next(LOGIN_STATE.HOME);
          return;
        }
        /* TODO: Handle error internet connection or place common message */
        ZebuLoginService.setErrorState(true, response["emsg"]);
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.SUBMISSION_ERROR);
      },
      (error) => {
        ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
      }
    );
  }

  initTwoFactorModel(data) {
    const questions = data["sQuestions"];
    ZebuLoginService.loginData.TwoFactor = {
      sIndex: data["sIndex"],
      sCount: data["sCount"],
      sQuestions: questions,
      splittedSQuestion: questions.split("|")
    };
  }

  /**
   * initChallengeQuestion will initialise challenge questions
   * based upon response.
   **/
  getChallengeQuestion(question: string) {
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
    /**
     * Send userID along with encrypted password for authentication
     */
    this.zebuLoginAPIService.encrpyUserLogin(
      JSON.stringify({
        userId: userInfo.userId,
        userData: encyptKey
      })
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
        this.initTwoFactorModel(data);
        setTimeout(() => {
          ZebuLoginService.zebuLoginState.next(LOGIN_STATE.PASSWORD_SUCCESS);
        }, 1000);
      } else {
        /* TODO: Confirm what are all the kinds of error comes here. */
        let errorMsg = ErrorConstant.MIS_MATCHED_CREDENTIALS;
        if (data['emsg'] === ErrorConstant.BLOCKED_USER) {
          errorMsg = ErrorConstant.BLOCKED_USER
        }
        ZebuLoginService.setErrorState(true, errorMsg);
      }
    }, (err) => {
      ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
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
    /**
     * Collecting public key to encrypt password before sending in request
     */
    this.zebuLoginAPIService.getEncryptKey(
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
      ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
    })
  }

  /**
   * Reset password will helps to reset their password when they forgot it.
   */
  resetPassword(jsonObj: ResetPasswordModel) {
    this.zebuLoginAPIService.forgotPass(jsonObj).subscribe(
      (response) => {
        const { stat, emsg } = response;
        if (stat === ResponseStatus.VALID_STATUS) {
          ZebuLoginService.zebuLoginState.next(LOGIN_STATE.PASSWORD_RESET_SUCCESS);
          return;
        }
        /* TODO: Validate internet connection error or place unique error message */
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.SUBMISSION_ERROR);
        ZebuLoginService.setErrorState(true, emsg);
      },
      (error) => {
        ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
      }
    );
  }

  /**
   * Make request to server to unblock an user as they blocked
   * due to some reason.
   */
  unblockUser(userInfo: object) {
    this.zebuLoginAPIService.unblockUser(userInfo).subscribe(
      (response: any) => {
        const { stat, emsg } = response;
        if (stat === ResponseStatus.VALID_STATUS) {
          ZebuLoginService.zebuLoginState.next(LOGIN_STATE.UNBLOCK_SUCCESS);
          return;
        }
        /* TODO: Validate internet connection error or place unique error message */
        ZebuLoginService.zebuLoginState.next(LOGIN_STATE.SUBMISSION_ERROR);
        ZebuLoginService.setErrorState(true, emsg);
      },
      (err) => {
        ZebuLoginService.setErrorState(true, ErrorConstant.STANDARD_ERROR);
      }
    );
  }

  /* Getter and setter kind of methods */
  static setLoginState(option: string) {
    ZebuLoginService.zebuLoginState.next(option);
  }

  static setErrorState(isError: boolean, msg: string) {
    ZebuLoginService.errorState.next({ IsError: isError, ErrorMsg: msg })
  }

  static enableProgressBar() {
    ZebuLoginService.isLoading.next(true);
  }

  static disableProgressBar() {
    ZebuLoginService.isLoading.next(false);
  }
}

export {
  ZebuLoginService,
};
