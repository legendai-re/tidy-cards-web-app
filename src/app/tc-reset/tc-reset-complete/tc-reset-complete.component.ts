import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { URLSearchParams  }             from '@angular/http';
import { Title }                        from '@angular/platform-browser';
import { TcHeaderService }              from '../../tc-header/tc-header.service';
import { TcAuthService }                from '../../tc-auth/tc-auth.service';
import { TcResetService }               from '../tc-reset.service';
import { TcUser }                       from '../../tc-user/tc-user.class';
import { TcLanguageService }            from '../../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-reset-complete.component.html',
    styleUrls: ['../../tc-auth/tc-auth.component.scss']
})

export class TcResetCompleteComponent implements OnInit, OnDestroy  {

    public password: string;
    public passwordRepeat: string;
    public resetToken: string;
    private sub: any;

    constructor(
        public t: TcLanguageService,
        private resetService: TcResetService,
        private route: ActivatedRoute,
        public authService: TcAuthService,
        public router: Router,
        public titleService: Title,
        public headerService: TcHeaderService) {
    }

    ngOnInit() {
        this.titleService.setTitle('Complete your password reset' + ' | TidyCards');

        this.headerService.emitUpdateHeaderEvent({
            value:{
                type: 'NO_HEADER'
            }
        });

        this.sub = this.route.params.subscribe(params => {
            this.resetToken = params['reset_token'];
            console.log(this.resetToken);
        });
    }

    public completeReset(){
        if(!this.password || this.password != this.passwordRepeat)
            return;
        this.resetService.putResetComplete(this.resetToken, this.password).subscribe((res) => {
            if(res.success){
                this.authService.initCurrentUser().then(success => {
                    this.router.navigate(['/', this.authService.currentUser.username]);
                })
            }
        })
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
