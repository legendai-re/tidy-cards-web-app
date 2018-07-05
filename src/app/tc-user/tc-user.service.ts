import { Http, Response, Headers, RequestOptions, URLSearchParams  } from '@angular/http';
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { TcUser }                   from './tc-user.class';
import { TcApiUrl }                 from '../tc-shared/tc-api-url';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcUserService {

    constructor (private http: Http) {}

    public getUser(_id: string, params: URLSearchParams): Observable<TcUser> {
        return this.http.get(TcApiUrl.USERS + '/' + _id, { search: params })
            .map(this.handleUser)
            .catch(this.handleError);
    }

    public getUsers (params: URLSearchParams): Observable<TcUser[]> {
        return this.http.get(TcApiUrl.USERS, { search: params })
        .map(this.handleUsers)
        .catch(this.handleError);
    }

    public putUser(user: TcUser): Observable<TcUser> {
        let body = JSON.stringify(user);
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.USERS + '/' + user._id, body, options)
            .map(this.handleUser)
            .catch(this.handleError);
    }

    public putConfirmEmail(token: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.CONFIRM_EMAIL + '/' + token, {}, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public putDeactivate(userId: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.USERS + '/' + userId + '/deactivate' , {}, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public putActivate(userId: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.USERS + '/' + userId + '/activate' , {}, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public putUserInvite(email: String): Observable<TcUser> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.USERS + '/invite/' +  email, {}, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public getValidUsername(username: string): Observable<boolean>{
        let params = new URLSearchParams();
        params.set('username', username);
        return this.http.get(TcApiUrl.VALID_USERNAME, { search: params })
            .map(this.handleIsValid)
            .catch(this.handleError);
    }

    public getValidEmail(email: string): Observable<boolean>{
        let params = new URLSearchParams();
        params.set('email', email);
        return this.http.get(TcApiUrl.VALID_EMAIL, { search: params })
            .map(this.handleIsValid)
            .catch(this.handleError);
    }

    private handleUsers(res: Response) {
        let body = res.json();
        let cs = [];
        for (let key in body.data) {
            cs.push(TcUser.createFormJson(body.data[key]));
        }
        return cs;
    }

    private handleUser(res: Response) {
        let body = res.json();
        return TcUser.createFormJson(body.data) || {};
    }

    private handleIsValid(res: Response){
        let body = res.json();
        return body.data.isValid;
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
