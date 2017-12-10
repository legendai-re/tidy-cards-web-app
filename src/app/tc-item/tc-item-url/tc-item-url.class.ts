export class TcItemUrl {

    public _id: string;
    public createdAt: Date;
    public updatedAt: Date;
    public url: string;
    public image: string;
    public host: string;
    public title: string;
    public description: string;
    public author: string;
    public type: string;
    public site_name: string;
    public noHttpUrl: string;

    constructor(
        _id?: string,
        createdAt?: Date | string,
        updatedAt?: Date | string,
        url?: string,
        image?: string,
        host?: string,
        title?: string,
        description?: string,
        author?: string,
        type?: string,
        site_name?: string) {
        this._id = _id;
        this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
        this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
        this.url = url;
        this.image = image;
        this.host = host;
        this.title = title;
        this.description = description;
        this.author = author;
        this.type = type;
        this.site_name = site_name;
        this.noHttpUrl = this.removeHttp(this.url);
    }

    public static createFormJson(obj) {
        if(!obj)
            return null;
        if(typeof obj === 'string'){
            var itemUrl = new TcItemUrl();
            itemUrl._id = obj;
            return itemUrl;
        }
        return new TcItemUrl(
            obj._id,
            obj.createdAt,
            obj.updatedAt,
            obj.url,
            obj.image,
            obj.host,
            obj.title,
            obj.description,
            obj.author,
            obj.type,
            obj.site_name
            );
    }

    public removeHttp(url){
        if(!url) return '';
        if(url.substring(0, 7) === 'http://'){
            url = url.substr(7);
        }else if(url.substring(0, 8) === 'https://'){
            url = url.substr(8);
        }
        return url;
    }
}
