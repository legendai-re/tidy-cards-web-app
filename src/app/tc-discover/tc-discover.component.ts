import { Component, OnInit }      from '@angular/core';
import { Router }                 from '@angular/router';
import { URLSearchParams  }       from '@angular/http';
import { Title }                  from '@angular/platform-browser';
import { TcAuthService }          from '../tc-auth/tc-auth.service';
import { TcCollectionService }    from '../tc-collection/tc-collection.service';
import { TcCollection }           from '../tc-collection/tc-collection.class';
import { TcDataLimit }            from '../tc-shared/tc-data-limit';
import { TcLanguageService }      from '../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-discover.component.html',
    styleUrls: ['./tc-discover.component.scss']
})
export class TcDiscoverComponent implements OnInit {

    public featuredCollections: TcCollection[];
    public popularCollections: TcCollection[];
    public lastCollections: TcCollection[];

    constructor(public t: TcLanguageService, public authService: TcAuthService, private router: Router, private titleService: Title, private collectionService: TcCollectionService) {
        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle(this.t._.header.discover_title + ' | TidyCards');
        })
    }

    ngOnInit() {
        if(this.t.langInitialized)
            this.titleService.setTitle(this.t._.header.discover_title + ' | TidyCards');
        this.loadFeaturedCollections();
        this.loadPopularCollections();
        this.loadLastCollections();
    }

    private loadFeaturedCollections(){
        let params = new URLSearchParams();
        params.set('limit', '8');
        params.set('sort_field', 'featuredAt');
        params.set('sort_dir', '-1');
        params.set('isFeatured', 'true');
        params.set('isOnDiscover', 'true');
        this.collectionService.getCollections(params).subscribe(collections => {
            this.featuredCollections = collections;
        }, () => {});
    }

    private loadPopularCollections(){
        let params = new URLSearchParams();
        params.set('limit', '8');
        params.set('sort_field', 'starsCount');
        params.set('sort_dir', '-1');
        this.collectionService.getCollections(params).subscribe(collections => {
            this.popularCollections = collections;
        }, () => {});
    }

    private loadLastCollections(){
        let params = new URLSearchParams();
        params.set('limit', '16');
        params.set('sort_field', 'createdAt');
        params.set('sort_dir', '-1');
        this.collectionService.getCollections(params).subscribe(collections => {
            this.lastCollections = collections;
        }, () => {});
    }


}
