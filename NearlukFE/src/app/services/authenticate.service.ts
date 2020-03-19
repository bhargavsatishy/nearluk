import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService implements CanActivate {

  constructor(public router: Router) { }
  public isAuthenticated(): any {
    let uname = sessionStorage.getItem('user');
    return uname
  }
  canActivate(): boolean {
    if (this.isAuthenticated()) {
      return true;
    }
    else {
      this.router.navigate(['login']);
    }
  }
}