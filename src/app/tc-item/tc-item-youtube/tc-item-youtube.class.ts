import { SafeResourceUrl } from '@angular/platform-browser';

export class TcItemYoutube {

    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;
    public url: string;
    public embedUrl: string;
    public videoId: string;
    public snippet: any;
    public trustedEmbedUrl: SafeResourceUrl;

    constructor(
        _id?: string,
        createdAt?: Date | string,
        updatedAt?: Date | string,
        url?: string,
        embedUrl?: string,
        videoId?: string,
        snippet?: any,
        trustedEmbedUrl?: SafeResourceUrl) {
        this._id = _id;
        this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
        this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
        this.url = url;
        this.url = url;
        this.embedUrl = embedUrl;
        this.videoId = videoId;
        this.snippet = snippet;
    }

    public static createFormJson(obj) {
        if(!obj)
            return null;
        if(typeof obj === 'string'){
            var itemYoutube = new TcItemYoutube();
            itemYoutube._id = obj;
            return itemYoutube;
        }
        return new TcItemYoutube(
            obj._id,
            obj.createdAt,
            obj.updatedAt,
            obj.url,
            obj.embedUrl,
            obj.videoId,
            obj.snippet,
            null
            );
    }
}
