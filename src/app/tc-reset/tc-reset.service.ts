import { Http, Response, Headers, RequestOptions, URLSearchParams  } from '@angular/http';
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { TcApiUrl }               from '../tc-shared/tc-api-url';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcResetService {

    constructor (private http: Http) {}

    public putResetInitiate(userId: string): Observable<any> {
        let body = JSON.stringify({user_id: userId});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.RESET_INITIATE, body, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public putResetComplete(resetToken: string, password: string): Observable<any> {
        let body = JSON.stringify({reset_token: resetToken, password: password});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.put(TcApiUrl.RESET_COMPLETE, body, options)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
