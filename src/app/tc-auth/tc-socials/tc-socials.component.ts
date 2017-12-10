import { Component, OnInit, OnDestroy }   from '@angular/core';
import { Router, ActivatedRoute }      from '@angular/router';
import { TcAuthService } from '../tc-auth.service';
import { TcLanguageService } from '../../tc-language/tc-language.service';

@Component({
    selector: 'tc-socials',
    templateUrl: './tc-socials.component.html',
    styleUrls: ['../tc-auth.component.scss']
})

export class TcSocialsComponent implements OnInit, OnDestroy{

    public sub: any;
    public encodedNextUrl: string;
    public nextUrl: string;

    constructor(public t: TcLanguageService, private route: ActivatedRoute, public authService: TcAuthService, public router: Router) {
    }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.encodedNextUrl = params['next'];
            this.nextUrl = decodeURIComponent(params['next']);
        });
    }

    public connectWith(strategy){
        var params = this.nextUrl != 'undefined' ? '?next='+this.encodedNextUrl : '?next=';
        window.location.href = 'auth/' + strategy + params;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
