import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {TcItem} from './tc-item.class';
import {TcApiUrl} from '../tc-shared/tc-api-url';
import {TcItemUrl} from './tc-item-url/tc-item-url.class';
import {TcItemYoutube} from './tc-item-youtube/tc-item-youtube.class';
import {TcItemImage} from './tc-item-image/tc-item-image.class';
import {TcItemTweet} from './tc-item-tweet/tc-item-tweet.class';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcItemService {

  constructor(private http: Http) {
  }

  public getItems(params: URLSearchParams): Observable<TcItem[]> {
    return this.http.get(TcApiUrl.ITEMS, {search: params})
      .map(this.handleItems)
      .catch(this.handleError);
  }

  public postItem(item: TcItem): Observable<TcItem> {
    const body = JSON.stringify(item);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(TcApiUrl.ITEMS, body, options)
      .map(this.handleItem)
      .catch(this.handleError);
  }

  public putItem(item: TcItem): Observable<TcItem> {
    const body = JSON.stringify(item);
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.put(TcApiUrl.ITEMS + '/' + item._id, body, options)
      .map(this.handleItem)
      .catch(this.handleError);
  }

  public postItemContent(url: String): Observable<any> {
    const body = JSON.stringify({url: url});
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(TcApiUrl.ITEMS_CONTENT_CREATE, body, options)
      .map(this.handleItemContent)
      .catch(this.handleError);
  }

  public deleteItem(_id: string): Observable<any> {
    return this.http.delete(TcApiUrl.ITEMS + '/' + _id);
  }

  private handleItems(res: Response) {
    const body = res.json();
    const cs = [];
    for (let key in body.data) {
      cs.push(TcItem.createFormJson(body.data[key]));
    }
    return cs;
  }

  private handleItem(res: Response) {
    const body = res.json();
    return TcItem.createFormJson(body.data) || {};
  }

  private handleItemContent(res: Response) {
    const body = res.json();
    if (body.error)
      return null;
    const itemType = body.data.itemType;
    if (!itemType)
      return null;
    switch (itemType) {
      case TcItem.ITEM_TYPES.URL.id:
        return {_content: TcItemUrl.createFormJson(body.data.itemContent), type: TcItem.ITEM_TYPES.URL.id};
      case TcItem.ITEM_TYPES.TWEET.id:
        return {_content: TcItemTweet.createFormJson(body.data.itemContent), type: TcItem.ITEM_TYPES.TWEET.id};
      case TcItem.ITEM_TYPES.IMAGE.id:
        return {_content: TcItemImage.createFormJson(body.data.itemContent), type: TcItem.ITEM_TYPES.IMAGE.id};
      case TcItem.ITEM_TYPES.YOUTUBE.id:
        return {_content: TcItemYoutube.createFormJson(body.data.itemContent), type: TcItem.ITEM_TYPES.YOUTUBE.id};
      default:
        return null;
    }
  }

  private handleError(error: any) {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

}
