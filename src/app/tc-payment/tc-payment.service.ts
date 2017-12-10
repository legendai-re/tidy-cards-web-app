import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TcApiUrl } from '../tc-shared/tc-api-url';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcPaymentService {

	constructor(private http: Http) {}

  	public postPayment (token: any, amount: number): Observable<Object> {
    	let body = JSON.stringify({stripeToken: token.id, stripeEmail: token.email, amount: amount});
    	let headers = new Headers({ 'Content-Type': 'application/json' });
    	let options = new RequestOptions({ headers: headers });
    	return this.http.post(TcApiUrl.PAYMENT_CHARGE, body, options)
    	.map(this.handleResponse)
    	.catch(this.handleError);
	}

	private handleResponse(res: Response) {
	    let body = res.json();
	    return body;
	}

	private handleError (error: any) {
	    let errMsg = (error.message) ? error.message :
	    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
	    console.error(errMsg);
	    return Observable.throw(errMsg);
	}

}