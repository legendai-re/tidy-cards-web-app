import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { URLSearchParams  }             from '@angular/http';
import { Title }                        from '@angular/platform-browser';
import { TcHeaderService }              from '../../tc-header/tc-header.service';
import { TcResetService }               from '../tc-reset.service';
import { TcAuthService }                from '../../tc-auth/tc-auth.service';
import { TcUserService }                from '../../tc-user/tc-user.service';
import { TcUser }                       from '../../tc-user/tc-user.class';
import { TcLanguageService }            from '../../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-reset-initiate.component.html',
    styleUrls: ['../../tc-auth/tc-auth.component.scss']
})

export class TcResetInitiateComponent implements OnInit, OnDestroy  {

    public user: TcUser;
    public searchData: string;
    public isSearching: boolean;
    public notFounded: boolean;
    public reseted: boolean;
    public resetError: boolean;
    private sub: any;

    constructor(
        public t: TcLanguageService,
        private resetService: TcResetService,
        private userService: TcUserService,
        private route: ActivatedRoute,
        public authService: TcAuthService,
        public router: Router,
        public titleService: Title,
        public headerService: TcHeaderService) {
    }

    ngOnInit() {
        this.titleService.setTitle('Reset password' + ' | TidyCards');

        this.headerService.emitUpdateHeaderEvent({
            value:{
                type: 'NO_HEADER'
            }
        });

        this.sub = this.route.params.subscribe(params => {
            this.searchData = params['user_id'];
            if(this.searchData)
                this.getUser();
        });
    }

    public getUser(){
        if(!this.searchData)
            return;
        this.isSearching = true;
        let params = new URLSearchParams();
        params.set('populate', '_avatar');
        this.userService.getUser(this.searchData.trim(), params).subscribe((user) => {
            if(user._id){
                this.user = user;
                this.notFounded = false;
            }else{
                this.notFounded = true;
            }
            this.isSearching = false;
        }, () => {
            this.isSearching = false;
            this.notFounded = true;
        })
    }

    public reSearch(){
        this.user = null;
    }

    private requestReset(){
        if(!this.user)
            return;
        this.resetService.putResetInitiate(this.user._id).subscribe((res) => {
            if(res.success){
                this.reseted = true;
            }else{
                this.resetError = true;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}
