import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { URLSearchParams  }             from '@angular/http';
import { Title }                        from '@angular/platform-browser';
import { TcHeaderService }              from '../../tc-header/tc-header.service';
import { TcAuthService }                from '../../tc-auth/tc-auth.service';
import { TcCollection }                 from '../../tc-collection/tc-collection.class';
import { TcUserService }                from '../tc-user.service';
import { TcUser }                       from '../tc-user.class';
import { TcLanguageService }            from '../../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-confirm-email.component.html',
    styleUrls: ['../../tc-auth/tc-auth.component.scss']
})

export class TcConfirmEmailComponent implements OnInit, OnDestroy  {

    public user: TcUser;
    public confirmationInProgress: boolean;
    public emailConfirmed: boolean;
    private sub: any;

    constructor(
        public t: TcLanguageService,
        private userService: TcUserService,
        private route: ActivatedRoute,
        public authService: TcAuthService,
        public router: Router,
        public titleService: Title,
        public headerService: TcHeaderService) {

        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle('Email confirmation' + ' | TidyCards');
        })
    }

    ngOnInit() {
        this.titleService.setTitle('Email confirmation' + ' | TidyCards');

        this.headerService.emitUpdateHeaderEvent({
            value:{
                type: 'NO_HEADER'
            }
        });

        this.sub = this.route.params.subscribe(params => {
            let confirm_token = params['confirm_token'];
            this.confirmEmail(confirm_token);
        });
        setTimeout( () => {
              $("#pageHeadings").removeClass('is-hidden');
              $("#pageContent").removeClass('is-hidden');
          }, 10);
    }

    private confirmEmail(token: string){
        this.confirmationInProgress = true;
        this.userService.putConfirmEmail(token).subscribe((res) => {
            this.emailConfirmed = res.success;
            this.authService.currentUser.emailConfirmed = true;
            this.confirmationInProgress = false;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
