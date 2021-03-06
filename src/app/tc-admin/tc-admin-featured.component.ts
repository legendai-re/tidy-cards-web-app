import { Component, OnInit } from '@angular/core';
import { Http, URLSearchParams  } from '@angular/http';
import {Title} from '@angular/platform-browser';
import { TcCollectionService } from '../tc-collection/tc-collection.service';
import { TcCollection } from '../tc-collection/tc-collection.class';
import {TcLanguageService} from '../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-admin-featured.component.html'
})

export class TcAdminFeaturedComponent implements OnInit {

    public searchCollectionId: string;
    public collection: TcCollection;
    public featuredCollections: TcCollection[];

    constructor (public t: TcLanguageService,
                 private titleService: Title,
                 private collectionService: TcCollectionService,
                 private http: Http) {
        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle('Featured Collections | Admin | TidyCards');
        });
    }

    ngOnInit() {
        if (this.t.langInitialized)
            this.titleService.setTitle('Featured Collections | Admin | TidyCards');
        this.loadFeaturedCollections();
    }

    public searchColletion() {
        const getParams = new URLSearchParams();
        getParams.set('populate', '_author+_thumbnail');
        this.collectionService.getCollection(this.searchCollectionId, getParams).subscribe((collection) => {
            this.collection = collection;
        });
    }

    public searchAnother() {
        this.collection = null;
    }

    private loadFeaturedCollections() {
        const params = new URLSearchParams();
        params.set('limit', '8');
        params.set('sort_field', 'createdAt');
        params.set('sort_dir', '-1');
        params.set('isFeatured', 'true');
        this.collectionService.getCollections(params).subscribe(collections => {
            this.featuredCollections = collections;
        }, () => {});
    }

    public updateCollection() {
        const toUpdateCollection = TcCollection.createFormJson({
          _id: this.collection._id,
          isFeatured: this.collection.isFeatured,
          isOnDiscover: this.collection.isOnDiscover
        });

        this.collectionService.putCollection(toUpdateCollection).subscribe((collection) => {
            console.log('done');
        });
    }

}
