export class TcItemTweet {

  public _id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public url: string;
  public author_name: string;
  public author_url: string;
  public html: string;
  public width: number;
  public height: number;
  public type: string;
  public cache_age: string;
  public provider_name: string;
  public provider_url: string;
  public version: string;

  constructor(_id?: string,
              createdAt?: Date | string,
              updatedAt?: Date | string,
              url?: string,
              author_name?: string,
              author_url?: string,
              html?: string,
              width?: number,
              height?: number,
              type?: string,
              cache_age?: string,
              provider_name?: string,
              provider_url?: string,
              version?: string) {
    this._id = _id;
    this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    this.url = url;
    this.author_name = author_name;
    this.author_url = author_url;
    this.html = html;
    this.width = width;
    this.height = height;
    this.type = type;
    this.cache_age = cache_age;
    this.provider_name = provider_name;
    this.provider_url = provider_url;
    this.version = version;
  }

  public static createFormJson(obj) {
    if (!obj)
      return null;
    if (typeof obj === 'string') {
      const itemTweet = new TcItemTweet();
      itemTweet._id = obj;
      return itemTweet;
    }
    return new TcItemTweet(
      obj._id,
      obj.createdAt,
      obj.updatedAt,
      obj.url,
      obj.author_name,
      obj.author_url,
      obj.html,
      obj.width,
      obj.height,
      obj.type,
      obj.cache_age,
      obj.provider_name,
      obj.provider_url,
      obj.version
    );
  }
}
