import { Injectable }             from '@angular/core';
import { Observable }             from 'rxjs/Observable';
import { FileUploader }           from 'ng2-file-upload/ng2-file-upload';
import { TcImage }                from './tc-image.class';
import { TcApiUrl }               from '../tc-shared/tc-api-url';


@Injectable()
export class TcImgUploadService {

    public uploader: FileUploader;

    constructor() {
        this.uploader = new FileUploader({url: TcApiUrl.IMAGES});
    }

    public tryUploadAndGetImage(event, type): Observable<TcImage> {
        this.setUploadUrl(type);
        return Observable.create(observer => {
            this.onfileChange(event).subscribe(observable => {
                observer.next(observable);
                observer.complete();
            });
        });
    }

    private setUploadUrl(type) {
        this.uploader.setOptions({url: TcApiUrl.IMAGES + '?type=' + type._id});
    }

    private onfileChange(event): Observable<TcImage> {
        return Observable.create(observer => {
            if ( event.currentTarget.files.length > 0 ) {
                setTimeout(() => {
                    for ( let i = 0; i < this.uploader.queue.length; i++ ) {
                        if ( !this.uploader.queue[i].isUploading ) {
                            this.uploadAndGetImage(this.uploader.queue[i]).subscribe(image => {
                                observer.next(image);
                                observer.complete();
                            });
                        }
                    }
                }, 100);
            }else{
                this.uploadAndGetImage(null).subscribe(image => {
                    observer.next(image);
                    observer.complete();
                });
            }
        });
    }

    private uploadAndGetImage(item): Observable<TcImage> {
        return Observable.create(observer => {
            if(item){
                item.upload();
                let interval = setInterval(() => {
                    if ( item._xhr != null && item._xhr.response && item._xhr.response != null && item._xhr.response !== '' ) {
                        observer.next(TcImage.createFormJson(JSON.parse(item._xhr.response).data));
                        item.remove();
                        clearInterval(interval);
                        observer.complete();
                    }
                }, 250);
            }else{
                observer.next(null);
                observer.complete();
            }
        });
    }
}
