import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { TcCollection } from './tc-collection.class';
import { TcApiUrl } from '../tc-shared/tc-api-url';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcCollectionService {

  constructor (private http: Http) {}

  public getCollection (_id: string, params: URLSearchParams): Observable<TcCollection> {
    return this.http.get(TcApiUrl.COLLECTIONS + '/' + _id, { search: params })
      .map(this.handleCollection)
      .catch(this.handleError);
  }

  public getCollections (params: URLSearchParams): Observable<TcCollection[]> {
    return this.http.get(TcApiUrl.COLLECTIONS, { search: params })
      .map(this.handleCollections)
      .catch(this.handleError);
  }

  public postCollection (collection: TcCollection): Observable<TcCollection> {
    const body = JSON.stringify(collection);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(TcApiUrl.COLLECTIONS, body, options)
      .map(this.handleCollection)
      .catch(this.handleError);
  }

  public putCollection (collection: TcCollection): Observable<TcCollection> {
    const body = JSON.stringify(collection);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(TcApiUrl.COLLECTIONS + '/' + collection._id, body, options)
      .map(this.handleCollection)
      .catch(this.handleError);
  }

  public putCollaborator (collectionId: string, collaboratorId: string): Observable<TcCollection> {
    const body = JSON.stringify({collaboratorId: collaboratorId});
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.put(TcApiUrl.COLLECTIONS + '/' + collectionId + '/collaborators', body, options)
      .map(this.handleCollection)
      .catch(this.handleError);
  }

  public deleteCollection (_id: string): Observable<any> {
    return this.http.delete(TcApiUrl.COLLECTIONS + '/' + _id);
  }

  private handleCollections(res: Response) {
    let body = res.json();
    let cs = [];
    for (let key in body.data) {
      cs.push(TcCollection.createFormJson(body.data[key]));
    };
    return cs;
  }

  private handleCollection(res: Response) {
    let body = res.json();
    return TcCollection.createFormJson(body.data) || {};
  }

  private handleError (error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(error);
  }

}
