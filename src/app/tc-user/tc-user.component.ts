import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { Observable }                   from 'rxjs/Observable';
import { TcAuthService }                from '../tc-auth/tc-auth.service';
import { TcUser }                       from './tc-user.class';

@Component({
    templateUrl: './tc-user.component.html',
    styleUrls: ['tc-user.component.scss']
})

export class TcUserComponent implements OnInit, OnDestroy  {

    private userId: string;
    private sub: any;
    private authSub: any
    private displayPublic: boolean;

    constructor(private route: ActivatedRoute, public authService: TcAuthService, public router: Router) {
        this.displayPublic = true;
        this.authSub = this.authService.getAuthInitializedEmitter()
        .subscribe((value) => {
            this.routeProfile(this.userId);
        });
    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.userId = params['user_id'];
            if(this.authService.authInitialized){
                this.routeProfile(this.userId);
            }
        });
    }

    private routeProfile(userId){
        if (this.authService.authInitialized && this.authService.isLoggedIn && this.authService.currentUser.username === userId) {
            this.displayPublic = false;
        } else {
            this.displayPublic = true;
        }
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.authSub.unsubscribe();
    }

}
