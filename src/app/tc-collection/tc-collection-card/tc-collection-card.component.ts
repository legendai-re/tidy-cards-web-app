import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TcLanguageService } from '../../tc-language/tc-language.service';
import { TcAuthService } from '../../tc-auth/tc-auth.service';
import { TcStarService } from '../../tc-star/tc-star.service';
import { TcCollectionService } from '../tc-collection.service';
import { TcCollection } from '../tc-collection.class';
import { TcApiUrl } from '../../tc-shared/tc-api-url';

declare let $: any;
declare var window: any;

@Component({
    selector: 'tc-collection-card',
    templateUrl: 'tc-collection-card.component.html',
    styleUrls: ['tc-collection-card.component.scss', '../../tc-item/tc-hover-actions.component.scss'],
})

export class TcCollectionCardComponent implements OnInit{

    public todayDate: Date;
    public isAuthor: boolean;
    public isUpdatingVisibility: boolean;
    public visibilityList: any;
    private isWorking: boolean;

    @Input() collection: TcCollection;
    @Input() sortable: boolean;

    constructor(
      public t: TcLanguageService,
      private collectionService: TcCollectionService,
      private starService: TcStarService,
      private authService: TcAuthService,
      private http: Http
    ) {
      this.visibilityList = TcCollection.VISIBILITY;
    }

    ngOnInit(){
      this.isWorking = false;
      this.isAuthor = (this.authService.isLoggedIn && this.authService.currentUser._id == this.collection._author._id);
      this.todayDate = new Date(), 'yyyy-MM-dd';
    }

    public copyCollectionLink(){
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.collection.getEncodedUri()
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
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

    public updateVisibiliy(visibility) {
      if (this.isUpdatingVisibility)
        return;

      if (!this.isAuthor)
        return;

      this.isUpdatingVisibility = true;
      this.collection.visibility = visibility;
      this.collectionService.putCollection(this.collection).subscribe(itemResponse => {
        this.collection.updatedAt = itemResponse.updatedAt;
        this.isUpdatingVisibility = false;
      });
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
