import { Component, OnInit }   from '@angular/core';
import { Router } from '@angular/router';
import { URLSearchParams  }   from '@angular/http';
import { Title }              from '@angular/platform-browser';
import { TcLanguageService }  from '../../tc-language/tc-language.service';
import { TcCollectionService }   from '../tc-collection.service';
import { TcCollection }   from '../tc-collection.class';
import { TcDataLimit }    from '../../tc-shared/tc-data-limit';

declare var window: any;

@Component({
    templateUrl: './tc-collection-popular.component.html'
})

export class TcCollectionPopularComponent implements OnInit {

    public pageNb: number;
    public haveMoreCollections: boolean;
    public loadingCollections: boolean;
    public collections: TcCollection[];

    constructor(
        public t: TcLanguageService,
        public router: Router,
        public collectionService: TcCollectionService,
        public titleService: Title) {

        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle(this.t._.collection.popular_title + ' | TidyCards');
        })
    }

    ngOnInit() {
        if(this.t.langInitialized)
            this.titleService.setTitle(this.t._.collection.popular_title + ' | TidyCards');
            window.analytics.page('Viewed Popular collections');
        this.pageNb = 0;
        this.loadingCollections = false;
        this.haveMoreCollections = true;
        this.collections = [];
        this.loadCollections();
    }

    public loadNextPage(){
        if(this.haveMoreCollections){
            this.pageNb++;
            this.loadCollections();
        }else{
            console.log('no more collections');
        }
    }

    private loadCollections(){
        this.loadingCollections = true;
        let params = new URLSearchParams();
        params.set('limit', TcDataLimit.COLLECTION.toString());
        params.set('skip', (TcDataLimit.COLLECTION * this.pageNb).toString());
        params.set('sort_field', 'starsCount');
        params.set('sort_dir', '-1');
        this.collectionService.getCollections(params).subscribe(collections => {
            this.onCollectionsReceived(collections);
        }, () => {});
    }

    private onCollectionsReceived(collections){
        for(let i in collections)
            this.collections.push(collections[i]);
        this.haveMoreCollections = (collections.length==TcDataLimit.COLLECTION);
        this.loadingCollections = false;
    }

}
