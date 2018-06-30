import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CookieService } from 'ngx-cookie-service';
import { TcUser } from '../tc-user/tc-user.class';
import { TcApiUrl } from '../tc-shared/tc-api-url';
import { TcLanguageService } from '../tc-language/tc-language.service';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

declare var window: any;

@Injectable()
export class TcAuthService {

  authInitializedEmitter: any;
  authInitialized: boolean;
  isLoggedIn: boolean;
  currentUser: TcUser;
  showCookieConsent: boolean;

  constructor (private languageService: TcLanguageService, private http: Http, private router: Router, private cookieService :CookieService) {
    this.authInitializedEmitter = new EventEmitter();
    this.authInitialized = false;
    this.isLoggedIn = false;
    this.currentUser = null;
  }

  private postLogin (username: string, password: string): Observable<TcUser> {
    const body = JSON.stringify({ username: username, password: password });
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(TcApiUrl.LOGIN, body, options)
      .map(this.handleUser)
      .catch(this.handleError);
  }

  private postSignup (user: TcUser): Observable<TcUser> {
    const body = JSON.stringify(user);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(TcApiUrl.SIGNUP, body, options)
      .map(this.handleUser)
      .catch(this.handleError);
  }

  public putPasswordUpdate (password: string, newPassword: string): Observable<any> {
    const body = JSON.stringify({password: password, newPassword: newPassword});
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(TcApiUrl.PASSWORD_UPDATE, body, options)
      .map((res) => res.json() )
      .catch(this.handleError);
  }

  private getCurrentUser (): Observable<TcUser> {
    return this.http.get(TcApiUrl.CURRENT_USER)
      .map(this.handleUser)
      .catch(this.handleError);
  }

  private getLogout (): Observable<Boolean> {
    return this.http.get(TcApiUrl.LOGOUT)
      .map(this.handleUser)
      .catch(this.handleError);
  }

  private handleUser(res: Response) {
    const body = res.json();
    return body.data ? TcUser.createFormJson(body.data) : {};
  }

  private handleError (error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(error.status);
  }

  public putUnlink (type: string): Observable<Boolean> {
    const body = JSON.stringify({type: type});
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(TcApiUrl.UNLINK, body, options)
      .map((res) => true )
      .catch(this.handleError);
  }

  public getAuthInitializedEmitter() {
    return this.authInitializedEmitter;
  }

  public login (username: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.postLogin(username, password).subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = true;
        this.languageService.loadLanguage(user);
        resolve({success: true});
      }, (err) => {
        this.isLoggedIn = false;
        resolve({success: false, error: err});
      });
    });
  }

  public signup (userParam: TcUser): Promise<Boolean> {
    return new Promise<Boolean>((resolve, reject) => {
      this.postSignup(userParam).subscribe(user => {
        this.currentUser = user;
        this.isLoggedIn = true;
        resolve(true);
      }, () => {
        this.isLoggedIn = false;
        resolve(false);
      });
    });
  }

  public initCookieConsent(){
    var cookieConsent = this.cookieService.get('tidycards-cookieconsent');
    var isSet = !!cookieConsent;
    this.showCookieConsent = !isSet
  }

  public acceptCookieConcent(){
    var now = new Date();
    now.setFullYear(now.getFullYear() + 2)
    this.cookieService.set('tidycards-cookieconsent', 'true', now)
    this.showCookieConsent = false;
    window.analytics.track('Accepted cookies');
  }

  public initCurrentUser(): Promise<Boolean> {
    this.initCookieConsent()
    return new Promise<Boolean>((resolve, reject) => {
      this.getCurrentUser().subscribe(user => {
        if (user._id) {
          this.currentUser = user;
          this.isLoggedIn = true;
          this.authInitialized = true;
          resolve(true);
        }else {
          this.isLoggedIn = false;
          this.authInitialized = true;
          resolve(false);
        }
        this.languageService.loadLanguage(user);
        this.authInitializedEmitter.emit({sucess: this.isLoggedIn});
      });
    });
  }

  public logout(): void {
    this.getLogout().subscribe(success => {
      this.isLoggedIn = false;
      this.currentUser = null;
      this.languageService.loadLanguage(null);
      this.router.navigate(['/']);
    });
  }
}
