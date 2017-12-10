import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { TcLanguageService } from '../../tc-language/tc-language.service';
import { TcAuthService } from '../../tc-auth/tc-auth.service';
import { TcStarService } from '../../tc-star/tc-star.service';
import { TcCollection } from '../tc-collection.class';
import { TcApiUrl } from '../../tc-shared/tc-api-url';

@Component({
    selector: 'tc-collection-card',
    templateUrl: 'tc-collection-card.component.html',
    styleUrls: ['tc-collection-card.component.scss'],
})

export class TcCollectionCardComponent implements OnInit{

    public isAuthor: boolean;
    private isWorking: boolean;

    @Input() collection: TcCollection;
    @Input() sortable: boolean;

    constructor(public t: TcLanguageService, private starService: TcStarService, private authService: TcAuthService, private http: Http) {
    }

    ngOnInit(){
        this.isWorking = false;
        this.isAuthor = (this.authService.isLoggedIn && this.authService.currentUser._id == this.collection._author._id);
    }

    public onStarCliked(){
        if(!this.authService.isLoggedIn || this.isWorking)
            return;
        if(!this.collection._star){
            this.addStarredCollection();
        }else{
            this.removeStarredCollection();
        }
    }

    private addStarredCollection(){
        this.isWorking = true;
        this.starService.postStar(this.collection).subscribe((star) => {
            this.collection._star = star;
            this.collection.starsCount++;
            this.isWorking = false;
        });
    }

    private removeStarredCollection(){
        this.starService.deleteStare(this.collection._star).subscribe((response) => {
            this.collection._star = null;
            this.collection.starsCount--;
            this.isWorking = false;
        })
    }

}
