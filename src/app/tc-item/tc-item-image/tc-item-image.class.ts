export class TcItemImage {

  public _id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public url: string;
  public host: string;

  constructor(_id?: string,
              createdAt?: Date | string,
              updatedAt?: Date | string,
              url?: string,
              host?: string) {
    this._id = _id;
    this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    this.url = url;
    this.host = host;
  }

  public static createFormJson(obj) {
    if (!obj)
      return null;
    if (typeof obj === 'string') {
      const itemImage = new TcItemImage();
      itemImage._id = obj;
      return itemImage;
    }
    return new TcItemImage(
      obj._id,
      obj.createdAt,
      obj.updatedAt,
      obj.url,
      obj.host
    );
  }
}
