import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TcAuthService } from '../tc-auth.service';
import { TcLanguageService } from '../../tc-language/tc-language.service';

declare var window: any;

@Component({
    selector: 'tc-signin',
    templateUrl: './tc-signin.component.html',
    styleUrls: ['../tc-auth.component.scss']
})

export class TcSigninComponent implements OnInit, OnDestroy{

    public sub: any;
    public encodedNextUrl: string;
    public nextUrl: string;
    public username: string;
    public password: string;
    public loginFailed: boolean;
    public longinInProgress: boolean;
    public errorStatusCode: number;

    constructor(public t: TcLanguageService, private route: ActivatedRoute, public authService: TcAuthService, public router: Router) {
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.encodedNextUrl = params['next'];
            this.nextUrl = decodeURIComponent(params['next']);
        });
    }

    onLoginSubmit() {
        this.longinInProgress = true;
        this.authService.login(this.username, this.password).then(result => {
            this.loginFailed = !result.success;
            if (result.success) {
                window.analytics.alias(this.authService.getAnonymousUuid(), this.authService.currentUser._id)
                window.analytics.identify(this.authService.currentUser._id, {
                    name: this.authService.currentUser.username,
                    email: this.authService.currentUser.email
                });
                window.analytics.track('Signed in', {
                    id: this.authService.currentUser._id,
                    email: this.authService.currentUser.email
                });
                const url = this.nextUrl !== 'undefined' ? this.nextUrl : '/';
                this.router.navigate([url]);
            }else {
                this.errorStatusCode = result.error;
            }
            this.longinInProgress = false;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
