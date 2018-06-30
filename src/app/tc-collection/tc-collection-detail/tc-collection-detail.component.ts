import {Component, OnInit, OnDestroy} from '@angular/core';
import {URLSearchParams} from '@angular/http';
import {Router, ActivatedRoute} from '@angular/router';
import {Title} from '@angular/platform-browser';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TcLanguageService} from '../../tc-language/tc-language.service';
import {TcAuthService} from '../../tc-auth/tc-auth.service';
import {TcStarService} from '../../tc-star/tc-star.service';
import {TcCollectionService} from '../tc-collection.service';
import {TcItemService} from '../../tc-item/tc-item.service';
import {TcCollection} from '../tc-collection.class';
import {TcHeaderService} from '../../tc-header/tc-header.service';
import {TcItem} from '../../tc-item/tc-item.class';
import {TcStar} from '../../tc-star/tc-star.class';
import {TcDataLimit} from '../../tc-shared/tc-data-limit';
import {TcUser} from '../../tc-user/tc-user.class';
import {TcUserService} from '../../tc-user/tc-user.service';

declare let $: any;

@Component({
  templateUrl: './tc-collection-detail.component.html',
  styleUrls: ['tc-collection-detail.component.scss', 'tc-collection-collaborators.component.scss', '../../tc-item/tc-item.component.scss']
})

export class TcCollectionDetailComponent implements OnInit, OnDestroy {

  public collection: TcCollection;
  public searchParams: string;
  public isLoadingCollection: boolean;
  public pageNb: number;
  public haveMoreItems: boolean;
  public loadingItems: boolean;
  public itemLoaded: boolean;
  public isAuthor: boolean;
  public isCollaborator: boolean;
  public haveEditRights: boolean;
  public isUpdatingStar: boolean;
  public isUpdatingPosition: boolean;
  public subCollectionTemplate: TcCollection;
  public currentModal: NgbModalRef;
  public cantFoundButwasStarred: boolean;
  public displayModeList: any;
  private sub: any;

  //collaborators related
  public searchCollabIntent: boolean;
  public manageCollabModal: NgbModalRef;
  public searchCollabInput: string;
  public newCollab: TcUser;
  public searchCollabsResult: TcUser[];
  public searchCollabsEmailResult: TcUser;
  public typingSearchCollabTimer;
  public doneTypingSearchCollabInterval: number;
  public searchCollabIsloading: boolean;

  constructor(public t: TcLanguageService,
              public authService: TcAuthService,
              private headerService: TcHeaderService,
              private route: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private collectionService: TcCollectionService,
              private itemService: TcItemService,
              private starService: TcStarService,
              private titleService: Title,
              private userService: TcUserService) {
    this.displayModeList = TcCollection.DISPLAY_MODE;
    this.doneTypingSearchCollabInterval = 1000;
  }

  ngOnInit() {
    this.pageNb = 0;
    this.loadingItems = false;
    this.haveMoreItems = true;
    this.isAuthor = false;
    this.isCollaborator = false;
    this.haveEditRights = false;
    this.subCollectionTemplate = new TcCollection();
    this.itemLoaded = false;
    this.cantFoundButwasStarred = false;
    this.searchCollabIntent = false;
    this.searchCollabIsloading = false;
    this.sub = this.route.params.subscribe(params => {
      this.initCollection(params);
    });
  }

  private openModal(content, sizeParam = null, centeredParam = true) {
    this.currentModal = this.modalService.open(content, {
      size: sizeParam,
      centered: centeredParam
    });
  }

  private openManageCollabModal(content, sizeParam = null, centeredParam = true) {
    var saveThis = this;
    this.modalService.open(content, {
      size: sizeParam,
      centered: centeredParam
    }).result.then((result) => {
      saveThis.setSearchCollabIntent(false);
    }, (reason) => {
      saveThis.setSearchCollabIntent(false);
    });
  }

  private openDeleteCollectionModal(content, sizeParam = null, centeredParam = true) {
    this.modalService.open(content, {
      size: sizeParam,
      centered: centeredParam
    }).result.then((result) => {
      if (result === 'confirm')
        this.deleteCollection();
    }, (reason) => {
    });
  }

  private openLeaveCollectionModal(content, sizeParam = null, centeredParam = true) {
    this.modalService.open(content, {
      size: sizeParam,
      centered: centeredParam
    }).result.then((result) => {
      if (result === 'confirm')
        this.deleteCollaborator(this.authService.currentUser);
    }, (reason) => {
    });
  }


  private initCollection(params) {
    this.searchParams = params['collection_id'];
    const getParams = new URLSearchParams();
    getParams.set('populate', '_author+_thumbnail');
    this.isLoadingCollection = true;
    this.collectionService.getCollection(this.searchParams, getParams).subscribe((collection) => {
      this.collection = collection;
      this.titleService.setTitle(this.collection.title + ' | TidyCards');
      this.collection._items = [];
      this.searchCollabsResult = this.collection._collaborators;
      if (this.authService.isLoggedIn) {
        if (collection._author._id === this.authService.currentUser._id)
          this.isAuthor = true;
        if (collection.haveEditRights(this.authService.currentUser))
          this.haveEditRights = true;
        this.isCollaborator = collection.isCollaborator(this.authService.currentUser);
      }
      this.isLoadingCollection = false;
      setTimeout(() => {
        $('#collectionDetailHeader').removeClass('is-hidden');
      }, 10);
      this.emitUpdateHeaderEvent();
      this.loadItems();
    }, (error) => {
      const errorBody = JSON.parse(error._body);
      let star = null;
      if (errorBody.data)
        star = errorBody.data._star;
      if (star) {
        this.collection = new TcCollection();
        this.collection._star = TcStar.createFormJson(star);
        this.cantFoundButwasStarred = true;
      }
      this.isLoadingCollection = false;
    });
  }

  private emitUpdateHeaderEvent() {
    this.headerService.emitUpdateHeaderEvent({
      value: {
        type: 'collection',
        color: this.collection.color,
        image: this.collection._thumbnail ? this.collection._thumbnail.getPath('1000x400') : '',
        title: this.collection.title
      }
    });
  }

  private loadItems() {
    this.loadingItems = true;
    const params = new URLSearchParams();
    params.set('_collection', this.collection._id);
    params.set('limit', TcDataLimit.ITEM.toString());
    params.set('skip', (TcDataLimit.ITEM * this.pageNb).toString());
    params.set('custom_sort', 'true');
    this.itemService.getItems(params).subscribe((items) => {
      this.onItemsReceived(items);
    });
  }

  private onItemsReceived(items) {
    items.sort(function (a, b) {
      if (a.position < b.position) return -1;
      if (a.position > b.position) return 1;
      return 0;
    });
    for (let i in items) {
      this.collection._items.push(items[i]);
    }
    this.haveMoreItems = (items.length === TcDataLimit.ITEM);
    this.loadingItems = false;
    this.itemLoaded = true;

  }

  public loadNextPage() {
    if (this.haveMoreItems) {
      this.pageNb++;
      this.loadItems();
    } else {
      console.log('no more items');
    }
  }

  public deleteCollection() {
    this.collectionService.deleteCollection(this.collection._id).subscribe((e) => {
      this.router.navigate(['/dashboard']);
    });
  }

  public onStarCliked() {
    if (!this.authService.isLoggedIn) {
      this.router.navigate(['/signin', {next: '/c/' + this.collection._id}]);
      return;
    }

    if (this.isUpdatingStar)
      return;

    if (!this.collection._star) {
      this.addStarredCollection();
    } else {
      this.removeStarredCollection();
    }
  }

  public onUpdateCollectionCanceled() {
    this.currentModal.close();
  }
  
  public onCreateItemCanceled() {
    this.currentModal.close();
  }
  
  public onCollectionUpdated(event) {
    if (event.value) {
      this.collection.title = event.value.title;
      this.collection.bio = event.value.bio;
      this.collection.color = event.value.color;
      this.collection.visibility = event.value.visibility;
      this.collection._thumbnail = event.value._thumbnail;
      this.emitUpdateHeaderEvent();
    }
    this.currentModal.close();
  }

  private addStarredCollection() {
    this.isUpdatingStar = true;
    this.starService.postStar(this.collection).subscribe((star) => {
      this.collection._star = star;
      this.collection.starsCount++;
      this.isUpdatingStar = false;
    });
  }

  private removeStarredCollection(redirectAfter = false) {
    this.starService.deleteStare(this.collection._star).subscribe((response) => {
      this.collection._star = null;
      this.collection.starsCount--;
      this.isUpdatingStar = false;
      if (redirectAfter)
        this.router.navigate(['/dashboard']);
    });
  }

  public onItemMoved(event) {
    this.isUpdatingPosition = true;
    this.itemService.putItem(event.value.modifiedItem).subscribe(collection => {
      this.isUpdatingPosition = false;
    }, (err) => {
      this.collection._items = [];
      this.pageNb = 0;
      this.loadItems();
      this.isUpdatingPosition = false;
    });
  }

  public onNewItem(event) {
    if (event.value) {
      this.collection._items.unshift(event.value);
      for (let i in this.collection._items) {
        this.collection._items[i].position = +i;
      }
      this.collection.itemsCount++;
      this.currentModal.close();
    }
  }

  public onSubCollectionCreated(event) {
    const itemCollection = new TcItem();
    itemCollection._content = event.value;
    itemCollection.type = TcItem.ITEM_TYPES.COLLECTION;
    itemCollection._collection = this.collection._id;
    this.itemService.postItem(itemCollection).subscribe((response) => {
      this.router.navigate(['/c', event.value._id]);
    });
  }

  public onDeletedItem(event) {
    if (event.value && event.value._id) {
      for (let i in this.collection._items) {
        if (this.collection._items[i]._id === event.value._id) {
          this.collection._items.splice(+i, 1);
          for (let x in this.collection._items) {
            this.collection._items[x].position = +x;
          }
          this.collection.itemsCount--;
        }
      }
    }
  }

  public onSearchCollabKeyUp(){
      this.searchCollabIsloading = true;
      clearTimeout(this.typingSearchCollabTimer);
      new Promise((resolve, reject) => {
          this.typingSearchCollabTimer = setTimeout(()=>{resolve(true);}, this.doneTypingSearchCollabInterval);
      }).then((e)=>{
          this.searchCollab();
      })
  }

  public onSearchCollabKeyDown(){
      clearTimeout(this.typingSearchCollabTimer);
  }

  public searchCollab() {
    if(!this.searchCollabInput){
      this.searchCollabIsloading = false;
      return;
    }
    this.searchCollabIsloading = true;
    if(this.searchCollabInput.indexOf('@') >= 0){
      const params = new URLSearchParams();
      params.set('populate', '_avatar');
      this.userService.getUser(this.searchCollabInput.trim(), params).subscribe((user) => {
        this.searchCollabsResult = [];
        if(user._id != this.collection._author._id)
          this.searchCollabsEmailResult = user;
        else
          this.searchCollabsEmailResult = null;
        this.searchCollabIsloading = false;
      }, () => {
        this.searchCollabsResult = [];
        this.searchCollabsEmailResult = null;
        this.searchCollabIsloading = false;
      });
    }else{
      let params = new URLSearchParams();
      params.set('limit', '10');
      params.set('populate', '_avatar');
      params.set('sort_field', 'createdAt');
      params.set('sort_dir', '-1');
      params.set('search', encodeURIComponent(this.searchCollabInput.trim()));
      this.userService.getUsers(params).subscribe(users => {
        // remove author from the result
        for(var i=0; i<users.length; i++){
          if(users[i]._id == this.collection._author._id){
           users.splice(i, 1)
          }
        }
        this.searchCollabsResult = users;
        this.searchCollabsEmailResult = null;
        this.searchCollabIsloading = false;
      }, () => {
        this.searchCollabsResult = [];
        this.searchCollabsEmailResult = null;
        this.searchCollabIsloading = false;
      });
    }
  }

  public setSearchCollabIntent(val: boolean){
    this.searchCollabsEmailResult = null;
    if(val){
      this.searchCollabIntent = true;
      this.searchCollabsResult = [];
    }else{
      this.searchCollabInput = "";
      this.searchCollabIntent = false;
      this.searchCollabsResult = this.collection._collaborators;
    }
  }

  public addCollaborator(user: TcUser) {
    this.collectionService.putCollaborator(this.collection._id, user._id).subscribe((Collection) => {
      this.collection._collaborators.push(user);
      this.collection.collaboratorsCount++;
    });
  }

  public deleteCollaborator(user: TcUser) {
    this.collectionService.deleteCollaborator(this.collection._id, user._id).subscribe((Collection) => {
      if(!this.isAuthor && this.collection.visibility == 'PRIVATE'){
        this.router.navigate(['/dashboard']);
      } else {
        var index = this.collection._collaborators.indexOf(user);
        this.collection._collaborators.splice(index, 1);
        this.collection.collaboratorsCount--;
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
