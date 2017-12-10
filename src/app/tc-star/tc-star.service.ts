import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { TcStar }                 from './tc-star.class';
import { TcCollection }           from '../tc-collection/tc-collection.class';
import { TcApiUrl }               from '../tc-shared/tc-api-url';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcStarService {

    constructor (private http: Http) {}

    public postStar (collection: TcCollection): Observable<TcStar> {
        let body = JSON.stringify({_collection: collection._id});
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(TcApiUrl.STAR, body, options)
        .map(this.handleStar)
        .catch(this.handleError);
    }

    public deleteStare (star: TcStar): Observable<any> {
        return this.http.delete(TcApiUrl.STAR + '/' + star._id);
    }

    private handleStar(res: Response) {
        let body = res.json();
        return TcStar.createFormJson(body.data) || {};
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
