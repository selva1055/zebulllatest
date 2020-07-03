import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

/* Feature module */
import { ZebuLoginServiceModule } from './zebu-login-service.module';

/* Feature service's models */
import { STORAGE_VARIABLEs } from './models/Localstorage';

@Injectable({
  providedIn: ZebuLoginServiceModule,
})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router) { }

  /* TODO: Build AUTH Guardian */
  canActivate(): boolean {
    const userToken = localStorage.getItem(STORAGE_VARIABLEs.SESSION_TOKEN);
    /* If token is not present then we navigating to login page*/
    if (!userToken) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
