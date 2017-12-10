import { Http, Response, Headers, RequestOptions, URLSearchParams  } from '@angular/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { TcApiUrl }               from '../tc-shared/tc-api-url';
import { TcUser }                 from '../tc-user/tc-user.class';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TcLanguageService {

    public langInitializedEmitter: any;
    public langInitialized: boolean = false;
    public currentLanguage: string;
    public unsafeCurrentLanguage: string;
    public _: any;

    constructor (private http: Http) {
        this._ = {};
        this.langInitializedEmitter = new EventEmitter();
    }

    private getMyLanguage(langId: string): Observable<any> {
        return this.http.get(TcApiUrl.LANGUAGES + '/' + langId)
            .map((res) => {return res.json()})
            .catch(this.handleError);
    }

    public updateLanguage(langId): Promise<boolean>{
        return new Promise<any>((resolve, reject) => {
            this.getMyLanguage(langId).subscribe((res) => {
                this._ = res.data;
                this.currentLanguage = this._.lang_id;
                this.unsafeCurrentLanguage = this._.lang_id;
                this.langInitialized = true;
                this.langInitializedEmitter.emit({sucess: true});
                resolve(true);
            })
        })
    }

    public loadLanguage(user: TcUser): Promise<boolean>{
        return new Promise<any>((resolve, reject) => {
            if(user && user.language)
                this.updateLanguage(user.language).then((res) => {resolve(true)});
            else
                this.updateLanguage(this.getBrowserLanguage()).then((res) => {resolve(true)});
        })
    }

    public format(str: string, args: string[]){
        if(!str)
            return;
        return str.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] !== 'undefined'
            ? args[number]
            : match
            ;
        });
    }

    public getLangInitializedEmitter() {
        return this.langInitializedEmitter;
    }

    public getBrowserLanguage(){ 
        var userLang = navigator.language;
        return (userLang) ? userLang.split('-')[0] : 'en';
    }

    private handleError (error: any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}
