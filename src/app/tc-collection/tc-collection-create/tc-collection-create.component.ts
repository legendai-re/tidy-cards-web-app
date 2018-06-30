import { Component, OnInit, EventEmitter, OnDestroy, Input, Output } from '@angular/core';
import { Router, ActivatedRoute }       from '@angular/router';
import { URLSearchParams  }             from '@angular/http';
import { TcAuthService }                from '../../tc-auth/tc-auth.service';
import { TcLanguageService }            from '../../tc-language/tc-language.service';
import { TcCollectionService }          from '../tc-collection.service';
import { TcCollection }                 from '../tc-collection.class';
import { TcImage }                      from '../../tc-image/tc-image.class';
import { TcImgUploadService }           from '../../tc-image/tc-image-upload.service';

declare var window: any;

@Component({
    selector: 'tc-collection-create',
    templateUrl: './tc-collection-create.component.html',
    styleUrls: ['../tc-collection-card/tc-collection-card.component.scss', 'tc-collection-create.component.scss'],
})

export class TcCollectionCreateComponent implements OnInit {
    public mode: string;
    public actionIntent: boolean;
    public collection: TcCollection;
    public uploader;
    public collectionCreated: boolean;
    public visibilityList: any;
    public isUploadingImage: boolean;

    @Input() parentCollection: TcCollection;
    @Input() inputCollection: TcCollection;
    @Output() newCollection = new EventEmitter();
    @Output() updateCanceled = new EventEmitter();

    constructor(public t: TcLanguageService,
            public collectionService: TcCollectionService,
            public imgUploadService: TcImgUploadService, 
            public router: Router,
            public authService: TcAuthService) {
        this.uploader = imgUploadService.uploader;
        this.visibilityList = TcCollection.VISIBILITY;
    }

    ngOnInit() {
        this.collectionCreated = false;
        this.isUploadingImage = false;
        if(this.inputCollection!=null){
            this.initUpdateMode();
        }else if(this.parentCollection!=null){
            this.initCreateSubCollectionMode();
        }else{
            this.initCreateMode();
        }
    }

    private initCreateMode(){
        this.mode = 'CREATE';
        this.collection = new TcCollection();
        this.collection.visibility = TcCollection.VISIBILITY.PRIVATE.id;
        this.collection.color = 'FFFFFF';
    }

    private initUpdateMode(){
        this.mode = 'UPDATE';
        this.collection = TcCollection.createFormJson(this.inputCollection);
        this.actionIntent = true;
    }

    private initCreateSubCollectionMode(){
        this.mode = 'CREATE_SUB_COLLECTION';
        this.collection = new TcCollection();
        this.collection.visibility = this.parentCollection.visibility;
        this.collection._parent = this.parentCollection._id;
    }

    public onThumbnailFileChange(event) {
        if(this.isUploadingImage)
            return;
        this.isUploadingImage = true;
        this.imgUploadService.tryUploadAndGetImage(event, TcImage.getTypes().COLLECTION_THUMBNAIL).subscribe(image => {
            this.collection._thumbnail = image;
            this.isUploadingImage = false;
        });
    }

    public onCollectionFocus(){
        if(this.collection.color == 'FFFFFF')
            this.collection.color = 'CFD8DC';
        this.actionIntent = true;
    }

    public clickColor(color){
        if(this.collection.color == color){
            this.collection.color = 'FFFFFF';
        }else{
            this.collection.color = color;
        }
    }

    public cancelCollectionUpdate(){
        this.updateCanceled.emit({value: null});
    }

    public onCollectionSubmit(){
        if(this.isUploadingImage)
            return;
        if(this.mode == 'CREATE' || this.mode == 'CREATE_SUB_COLLECTION')
            this.createCollection();
        else
            this.updateCollection();
    }

    private createCollection() {
        if(!this.collection.color || this.collection.color == 'FFFFFF' ){
            this.collection.color = 'CFD8DC';
        }
        this.collectionService.postCollection(this.collection).subscribe(collection => {
            this.collection._id = collection._id;
            this.collectionCreated = true;
            this.newCollection.emit({
                value: this.collection
            });
            window.analytics.track('Created a collection', {
                collection_title: this.collection.title,
                collection_bio: this.collection.bio,
                collection_thumbnail: this.collection._thumbnail,
                visibility: this.collection.visibility
            });
        });
    }

    private updateCollection() {
        this.collectionService.putCollection(this.collection).subscribe(collectionResponse => {
            this.collection.updatedAt = collectionResponse.updatedAt;
            this.newCollection.emit({
                value: this.collection
            });
            window.analytics.track('Updated a collection', {
                collection_title: this.collection.title,
                collection_bio: this.collection.bio,
                collection_thumbnail: this.collection._thumbnail,
                visibility: this.collection.visibility
            });
        });
    }

}
