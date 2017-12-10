import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router }               from '@angular/router';
import { TcAuthService }        from './tc-auth/tc-auth.service';
import { TcLanguageService }    from './tc-language/tc-language.service';
import { TcHeaderService }      from './tc-header/tc-header.service';

@Component({
    selector: 'tc-app',
    templateUrl: './tc-app.component.html',
    styleUrls: ['./tc-app.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class TcAppComponent {

    constructor(public headerService: TcHeaderService, public t: TcLanguageService, public authService: TcAuthService, public router: Router) {
        var url = null;
        this.router.events.subscribe((route) => {
            if(!url){
                var routeAny:any;
                routeAny = route;
                url=routeAny.url.split(';')[0];
                let params = [];
                for(let i=1; i<routeAny.url.split(';').length; i++){
                    var keyValue=routeAny.url.split(';')[i].split('=');
                    if(keyValue.length == 2)
                        params[keyValue[0]] = decodeURIComponent(keyValue[1]);
                }
                authService.initCurrentUser().then(success => {
                    router.initialNavigation();
                    url = url.replace("#_=_", "");
                    if(url != '/' && url != '/discover')
                        this.router.navigate([url, params]);
                    if(this.authService.isLoggedIn && url == '/')
                        this.router.navigate([url]);
                });
            }
        })
    }
}
