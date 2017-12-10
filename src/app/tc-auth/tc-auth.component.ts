import { Component, OnInit }   from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title }                  from '@angular/platform-browser';
import { TcAuthService } from './tc-auth.service';
import { TcHeaderService } from '../tc-header/tc-header.service';
import { TcLanguageService } from '../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-auth.component.html',
    styleUrls: ['./tc-auth.component.scss']
})

export class TcAuthComponent implements OnInit{

    public mode: string;
    private sub: any;

    constructor(
        public t: TcLanguageService,
        private headerService: TcHeaderService,
        public authService: TcAuthService,
        public router: Router,
        private route: ActivatedRoute,
        private titleService: Title) {

        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle(this.t._.auth.signin_title + ' | TidyCards');
        })
    }

    ngOnInit(){
        if(this.t.langInitialized)
            this.titleService.setTitle(this.t._.auth.signin_title + ' | TidyCards');

        this.mode = 'socials';
        this.headerService.emitUpdateHeaderEvent({
            value:{
                type: 'NO_HEADER'
            }
        });
        this.sub = this.route.params.subscribe(params => {
            if(params['mode'] == 'signup')
                this.mode = 'signup';
        });
    }

}
