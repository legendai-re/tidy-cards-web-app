import {TcItemUrl} from './tc-item-url/tc-item-url.class';
import {TcItemYoutube} from './tc-item-youtube/tc-item-youtube.class';
import {TcItemImage} from './tc-item-image/tc-item-image.class';
import {TcItemTweet} from './tc-item-tweet/tc-item-tweet.class';
import {TcCollection} from '../tc-collection/tc-collection.class';
import {TcUser} from '../tc-user/tc-user.class';

export class TcItem {

  public _id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public description: string;
  public type: any;
  public _content: any;
  public _collection: string;
  public position: number;
  public updatePosition: boolean;
  public title: string;
  public host: string;
  public displayMode: string;
  public _author: TcUser;

  constructor(_id?: string,
              createdAt?: Date | string,
              updatedAt?: Date | string,
              description?: string,
              type?: any,
              _content?: TcItemUrl | TcItemYoutube | TcItemImage | TcItemTweet | TcCollection,
              _collection?: string,
              position?: number,
              title?: string,
              host?: string,
              displayMode?: string,
              _author?: TcUser) {
    this._id = _id;
    this.createdAt = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
    this.updatedAt = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;
    this.description = description;
    this.type = type;
    this._content = _content;
    this._collection = _collection;
    this.position = position;
    this.title = title;
    this.host = host;
    this.displayMode = displayMode;
    this._author = _author;
  }

  public static get ITEM_TYPES() {
    return {
      "URL": {
        "id": "URL",
        "available_display_modes": [
          "SMALL",
          "MEDIUM"
        ],
        "default_display_mode": "MEDIUM"
      },
      "IMAGE": {
        "id": "IMAGE",
        "available_display_modes": [
          "SMALL",
          "LARGE"
        ],
        "default_display_mode": "LARGE"
      },
      "YOUTUBE": {
        "id": "YOUTUBE",
        "available_display_modes": [
          "SMALL",
          "MEDIUM",
          "LARGE"
        ],
        "default_display_mode": "LARGE"
      },
      "TWEET": {
        "id": "TWEET",
        "available_display_modes": [
          "SMALL",
          "MEDIUM",
          "LARGE"
        ],
        "default_display_mode": "LARGE"
      },
      "TEXT": {
        "id": "TEXT",
        "available_display_modes": [],
        "default_display_mode": ""
      },
      "COLLECTION": {
        "id": "COLLECTION",
        "available_display_modes": [],
        "default_display_mode": ""
      }
    };
  }

  public static createFormJson(obj) {
    if (!obj)
      return null;
    return new TcItem(
      obj._id,
      obj.createdAt,
      obj.updatedAt,
      obj.description,
      obj.type,
      TcItem.getContent(obj),
      obj._collection,
      obj.position,
      obj.title,
      obj.host,
      obj.displayMode,
      TcUser.createFormJson(obj._author)
    );
  }

  public static getContent(obj): any {
    const type = obj.type;
    switch (type) {
      case TcItem.ITEM_TYPES.URL.id:
        return TcItemUrl.createFormJson(obj._content);
      case TcItem.ITEM_TYPES.YOUTUBE.id:
        return TcItemYoutube.createFormJson(obj._content);
      case TcItem.ITEM_TYPES.IMAGE.id:
        return TcItemImage.createFormJson(obj._content);
      case TcItem.ITEM_TYPES.TWEET.id:
        return TcItemTweet.createFormJson(obj._content);
      case TcItem.ITEM_TYPES.COLLECTION.id:
        return TcCollection.createFormJson(obj._content);
      default:
        return null;
    }

  }
}
