import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { URLSearchParams  }     from '@angular/http';
import { TcLanguageService }    from '../tc-language/tc-language.service';
import { TcHeaderService }      from '../tc-header/tc-header.service';
import { TcCollection }         from '../tc-collection/tc-collection.class';
import { TcCollectionService }  from '../tc-collection/tc-collection.service';
import { TcUser }               from '../tc-user/tc-user.class';
import { TcUserService }        from '../tc-user/tc-user.service';
import { TcDataLimit }          from '../tc-shared/tc-data-limit';
import { TcSearchService }      from './tc-search.service';

@Component({
    selector: 'tc-search-header',
    templateUrl: './tc-search-header.component.html',
    styleUrls: ['./tc-search-header.component.scss']
})

export class TcSearchHeaderComponent implements OnInit, OnDestroy {

    public emittedSearchQuery: string;
    public searchQuery: string;
    public users: TcUser[];
    public usersPageNb: number;
    public isLoadingUsers: boolean;
    public collections: TcCollection[];
    public collectionsPageNb: number;
    public isLoadingCollections: boolean;
    public requestTime: Date;
    private searchSub: any;

    constructor(
        private t: TcLanguageService,
        private searchService: TcSearchService,
        private userService: TcUserService,
        private collectionService: TcCollectionService,
        public route: ActivatedRoute,
        public headerService: TcHeaderService,
        public router: Router) {

    }

    ngOnInit(){
        this.resetResult();
        this.searchSub = this.searchService.getUpdateSearchQueryEmitter().subscribe((value) => {
            this.resetResult();
            this.searchQuery = value.searchQuery;
            this.search();
        });
    }

    public resetResult(){
        this.collectionsPageNb = 0;
        this.collections = [];
        this.usersPageNb = 0;
        this.users = [];
    }

    public search(){
        if(!this.searchQuery || this.searchQuery == '')
            return;
        this.searchCollections();
        this.searchUsers();
    }

    public searchCollections(){
        this.isLoadingCollections = true;
        let params = new URLSearchParams();
        params.set('limit', TcDataLimit.COLLECTION.toString());
        params.set('skip', (TcDataLimit.COLLECTION * this.collectionsPageNb).toString());
        params.set('sort_field', 'createdAt');
        params.set('sort_dir', '-1');
        params.set('search', encodeURIComponent(this.searchQuery.trim()));
        this.collectionService.getCollections(params).subscribe(collections => {
            if(this.collectionsPageNb == 0)
                this.collections = collections;
            else{
                for(let i in collections)
                    this.collections.push(collections[i]);
            }
            this.isLoadingCollections = false;
        }, () => {});
    }

    public searchUsers(){
        this.isLoadingUsers = true;
        let params = new URLSearchParams();
        params.set('limit', TcDataLimit.COLLECTION.toString());
        params.set('skip', (TcDataLimit.COLLECTION * this.usersPageNb).toString());
        params.set('populate', '_avatar');
        params.set('sort_field', 'createdAt');
        params.set('sort_dir', '-1');
        params.set('search', encodeURIComponent(this.searchQuery.trim()));
        this.userService.getUsers(params).subscribe(users => {
            if(this.usersPageNb == 0)
                this.users = users;
            else{
                for(let i in users)
                    this.users.push(users[i]);
            }
            this.isLoadingUsers = false;
        }, () => {});
    }

    ngOnDestroy() {
        this.searchSub.unsubscribe();
    }
}
