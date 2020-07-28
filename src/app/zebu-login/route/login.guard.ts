import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';

/* Model */
import { ROUTEs } from '@zebu-login/models/Route';
import {
  LOGIN_STATE
} from "@zebu-login/models/Navigation";

/* Service */
import { ZebuLoginService } from '@zebu-login/services/zebu-login.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivateChild {

  constructor(public router: Router) { }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    /* Getting current state */
    const currentState: string = ZebuLoginService.zebuLoginState.getValue();
    /**
     * If there are any error with submission page
     * then we making it stay in the same page
     * */
    if (currentState === LOGIN_STATE.SUBMISSION_ERROR) {
      return true;
    }
    const navFlag = this.validatePath(state.url.substr(1), currentState);
    if (navFlag) {
      this.resetLoginState();
    }
    return navFlag;
  }

  validatePath(currentPath: string, currentState: string): boolean {
    switch (currentPath) {
      case ROUTEs.PASSWORD.path: {
        if (currentState !== LOGIN_STATE.PASSWORD_SECTION) {
          this.router.navigate(["login"]);
          return false;
        }
        break;
      }
      case ROUTEs.CHALLENGE.path: {
        if (currentState !== LOGIN_STATE.PASSWORD_SUCCESS) {
          this.router.navigate(["login"]);
          return false;
        }
        break;
      }
      case ROUTEs.CONFIRM_M_PIN.path: {
        if (currentState !== LOGIN_STATE.MPIN_AND_HOME) {
          this.router.navigate(["login"]);
          return false;
        }
        break;
      }
      case ROUTEs.M_PIN.path: {
        if (currentState !== LOGIN_STATE.MPIN_SECTION) {
          this.router.navigate(["login"]);
          return false;
        }
        break;
      }
      case ROUTEs.PASSWORD_RENEW.path: {
        if (
          currentState !== LOGIN_STATE.RENEW_AND_HOME
          && currentState !== LOGIN_STATE.RENEW_AND_MPIN
        ) {
          this.router.navigate(["login"]);
          return false;
        }
        break;
      }
    }
    /**
     * If the route is not fallen into any of the above condition
     * then allowing to flow without any block
     **/
    return true;
  }

  resetLoginState() {
    ZebuLoginService.setErrorState(false, "");
  }
}
