import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title }                from '@angular/platform-browser';
import { URLSearchParams  }     from '@angular/http';
import { SafeResourceUrl }      from '@angular/platform-browser';
import { TcAuthService }        from '../tc-auth/tc-auth.service';
import { TcHeaderService }      from './tc-header.service';
import { TcLanguageService }    from '../tc-language/tc-language.service';
import { TcDataLimit }          from '../tc-shared/tc-data-limit'
import { TcSearchService }      from '../tc-search/tc-search.service';
import { TcBase64 }             from '../tc-shared/tc-base64.service';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TcCollectionService} from '../tc-collection/tc-collection.service';
import {TcCollection} from '../tc-collection/tc-collection.class';

@Component({
  selector: 'tc-header',
  templateUrl: './tc-header.component.html',
  styleUrls: ['./tc-header.component.scss', '../tc-collection/tc-collection-create/tc-collection-update.component.scss']
})
export class TcHeaderComponent implements OnInit, OnDestroy{

  public searchQuery: string;
  public lastSearchQuery: string;
  public type: string;
  public color: string;
  public image: any;
  public title: string;
  public noHeader: boolean;
  public headerState: string;
  public defaultColor: string;
  public previousRoute: string;
  public typingQueryTimer;
  public doneTypingQueryInterval: number;
  private headerSub: any;

  public currentModal: NgbModalRef;

  @HostListener('document:keyup', ['$event'])
  keypress(e: KeyboardEvent) {
    /* if Escape pressed */
    if(e.keyCode==27)
      this.cancelSearch();
  }

  constructor(
    private titleService: Title,
    private Base64: TcBase64,
    private _location: Location,
    public t: TcLanguageService,
    public headerService: TcHeaderService,
    public searchService: TcSearchService,
    public authService: TcAuthService,
    public router: Router,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    private service: TcCollectionService
  ) {
    this.doneTypingQueryInterval = 250;
    this.defaultColor = '6B5DFF';
    this.headerState = 'default';
    this.router.events.subscribe((route) => {
      if(route instanceof NavigationEnd){
        this.setPreviousRoute(route);

        if(this.isDiscoverPage(route))
          this.setDiscoverPage();
        else if(this.isSearchPage(route))
          this.setSearchPage();
        else
          this.setDefault();
      }
    })
  }

  ngOnInit() {
    this.headerSub = this.headerService.getUpdateHeaderEmitter().subscribe((value) => {
      this.updateHeader(value);
    });
  }

  private updateHeader(event){
    if(event.value.type === 'DEFAULT'){
      this.setDefault();
    }else if(event.value.type === 'SEARCH'){
      this.setSearchPage();
      let tmpThis = this;
      setTimeout(() => {
        this.searchQuery = decodeURIComponent(event.value.searchQuery);
        tmpThis.searchService.emitUpdateSearchQueryEvent({searchQuery: this.searchQuery});
      }, 200)
    }else if(event.value.type === 'NO_HEADER'){
      this.headerState = 'no_header';
      let tmpThis = this;
      setTimeout(() => {
        this.noHeader = true;
        this.headerService.noHeader = true;
      }, 200)
    }else if(event.value.type === 'collection'){
      this.headerState = 'collection';
      this.type = event.value.type;
      this.color = event.value.color;
      this.image = event.value.image;
      this.title = event.value.title;
      this.headerService.noFooter = false;
    }else if(event.value.type === 'page'){
      this.headerState = 'page';
      this.color = this.defaultColor;
      this.image = null;
    }else{
      this.setDefault();
    }
  }

  private setDefault(){
    this.headerState = 'default';
    this.noHeader = false;
    this.headerService.noHeader = false;
    this.headerService.noFooter = false;
    this.color = this.defaultColor;
    this.image = null;
    this.title = '';
  }

  private setPreviousRoute(routeEvent){
    if(!this.isSearchPage(routeEvent))
      this.previousRoute = routeEvent.url;
  }

  private isSearchPage(routeEvent){
    return routeEvent.url.split(';')[0] == '/search';
  }

  private isDiscoverPage(routeEvent){
    var url = routeEvent.url.split(';')[0];
    if(url == '/discover' || (!this.authService.isLoggedIn && url == '/'))
      return true;
    return false;
  }

  private setDiscoverPage(){
    this.headerState = 'discover';
    this.noHeader = false;
    this.headerService.noHeader = false;
    this.headerService.noFooter = false;
    this.color = this.defaultColor;
    this.image = null;
    this.title = '';
  }

  private setSearchPage(){
    this.headerState = 'search';
    this.noHeader = false;
    this.headerService.noHeader = false;
    this.headerService.noFooter = true;
    this.color = this.defaultColor;
    this.image = null;
    this.title = '';
  }

  public searchIntent(){
    if(this.headerState === 'search')
      return;
    this.headerState = 'search';
    if(this.searchQuery && this.searchQuery != '')
      this.router.navigate(['/search', {q: this.searchQuery}]);
    else
      this.router.navigate(['/search']);
  }

  public cancelSearch(){
    //this.headerState = 'default';
    var toGo = typeof this.previousRoute == 'string' ? this.previousRoute :'/';
    this.router.navigate([toGo]);
  }

  public onQueryKeyUp(){
    if(this.headerState!='search')
      this.searchIntent();
    this.updateUrl();
    clearTimeout(this.typingQueryTimer);
    new Promise((resolve, reject) => {
      this.typingQueryTimer = setTimeout(()=>{resolve(true);}, this.doneTypingQueryInterval);
    }).then((e)=>{
      this.onSearchQueryChange();
    })
  }

  public onQueryKeyDown(){
    clearTimeout(this.typingQueryTimer);
  }

  public onSearchQueryChange(){
    if(this.lastSearchQuery == this.searchQuery)
      return;
    this.lastSearchQuery = this.searchQuery;
    this.searchService.emitUpdateSearchQueryEvent({searchQuery: this.searchQuery});
  }

  private openModal(content, sizeParam = null, centeredParam = true) {
    this.currentModal = this.modalService.open(content, {
      size: sizeParam,
      centered: centeredParam
    });
  }

  public onCollectionCreated(event) {
    if (event.value) {
      this.router.navigate(['/c', event.value._id]);
      this.currentModal.close();
    }
  }

  public onCreateCollectionCanceled() {
    this.currentModal.close();
  }

  private updateUrl(){
    if(this.searchQuery && this.searchQuery != '')
      this._location.go('/search;q='+ encodeURIComponent(this.searchQuery.trim()));
    else
      this._location.go('/search');
  }

  ngOnDestroy() {
    this.headerSub.unsubscribe();
  }
}
