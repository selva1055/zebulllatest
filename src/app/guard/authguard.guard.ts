import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ZebuodrGentrService } from 'src/app/services/zebuodr-gentr.service'

@Injectable({
  providedIn: 'root'
})
export class AuthguardGuard implements CanActivate {


  constructor(private router: Router,
    private ZebuodrGentrService: ZebuodrGentrService
  ) { }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const currentUser = localStorage.getItem("tokenId");
    if (currentUser) {
      // authorised so return true
      return true;
    }
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
