import {Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import {TcLanguageService} from '../../tc-language/tc-language.service';
import {TcCollection} from '../../tc-collection/tc-collection.class';
import {TcItem} from '../tc-item.class';
import {TcItemService} from '../tc-item.service';

@Component({
  selector: 'tc-item-create',
  styleUrls: ['tc-item-create.component.scss'],
  templateUrl: './tc-item-create.component.html'
})

export class TcItemCreateComponent implements OnInit {

  public availableDisplayModes: string[];

  @Input() item: TcItem;
  @Input() collection: TcCollection;
  @Output() newItem = new EventEmitter();
  @Output() updateCanceled = new EventEmitter();

  mode: string;
  itemCreated: boolean;
  urlEntry: string;
  loadingContent: boolean;
  itemTypes: any;
  validUrl: boolean;
  addDescription: boolean;
  typingTimer;
  doneTypingInterval: number;

  constructor(public t: TcLanguageService, private itemService: TcItemService) {
    this.doneTypingInterval = 300;
    this.itemTypes = TcItem.ITEM_TYPES;
  }

  ngOnInit() {
    this.init();
    this.availableDisplayModes = TcItem.ITEM_TYPES["URL"].available_display_modes;
  }

  private init() {
    this.itemCreated = false;
    this.loadingContent = false;
    this.addDescription = true;
    if (this.item) {
      this.initUpdateMode();
    } else {
      this.initCreateMode();
    }
  }

  private initCreateMode() {
    this.mode = 'CREATE';
    this.item = new TcItem();
    this.item._collection = this.collection._id;
    this.item.displayMode = 'MEDIUM';
    this.urlEntry = '';
    this.validUrl = false;
    this.addDescription = true;
  }

  private initUpdateMode() {
    this.mode = 'UPDATE';
    this.item = TcItem.createFormJson(this.item);
    if (this.item._content !== null) {
      if (!this.item.description || this.item.description === '')
        this.item.description = this.item._content.url;
      this.urlEntry = this.item._content.url;
      this.validUrl = true;
    }
    if (this.item.description) this.addDescription = true;
  }

  public onUrlKeyDown(event) {
    if (event.keyCode === 65 && event.ctrlKey) {
      event.target.select();
    }
    clearTimeout(this.typingTimer);
  }

  public onDescriptionKeyDown(event) {
    if (event.keyCode === 65 && event.ctrlKey) {
      event.target.select();
    }
  }

  public parseDescriptionForUrl() {
    var regexRes = RegExp('(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-ZÀ-ÿ0-9+&@#/%=~_|$?()!:;,.]*\)|[-A-ZÀ-ÿ0-9+&@#/%=~_|$?()!:;,.])*(?:\([-A-ZÀ-ÿ0-9+&@#/%=~_|$?()!:,.]*\)|[A-ZÀ-ÿ0-9+&@#/%()=~_|$])', 'igm').exec(this.item.description);
    this.urlEntry = regexRes ? regexRes[0] : null;

    clearTimeout(this.typingTimer);
    new Promise((resolve, reject) => {
      this.typingTimer = setTimeout(() => {
        resolve(true);
      }, this.doneTypingInterval);
    }).then((e) => {
      this.createContentFromUrl();
    });
  }

  private createContentFromUrl() {
    if (this.item._content != null || !this.urlEntry || this.urlEntry === '')
      return;

    this.loadingContent = true;
    this.itemService.postItemContent(this.urlEntry).subscribe((result) => {
      if (result) {
        this.item.type = result.type;
        this.availableDisplayModes = TcItem.ITEM_TYPES[this.item.type].available_display_modes;
        this.item.displayMode = TcItem.ITEM_TYPES[this.item.type].default_display_mode;
        this.item._content = result._content;
        if (!this.item.title)
          this.item.title = this.getItemTitle();
        this.validUrl = true;
      } else {
        this.item._content = null;
        this.validUrl = false;
      }
      this.loadingContent = false;
    });
  }

  private getItemTitle() {
    switch (this.item.type) {
      case TcItem.ITEM_TYPES.URL.id:
        return this.item._content.title;
      case TcItem.ITEM_TYPES.IMAGE.id:
        return 'image - ' + this.item._content.host;
      case TcItem.ITEM_TYPES.YOUTUBE.id:
        return this.item._content.snippet.title;
      case TcItem.ITEM_TYPES.TWEET.id:
        return 'tweet';
      case TcItem.ITEM_TYPES.COLLECTION.id:
        return this.item._content.title;
      default:
        return '';
    }
  }

  public resetItemContent() {
    this.urlEntry = '';
    this.item._content = null;
    this.validUrl = false;
  }

  public onItemSubmit() {
    if (this.isValidToSave()) {
      if (this.mode == 'CREATE')
        this.createItem();
      else
        this.updateItem();
    }
  }

  private isValidToSave() {
    if (!this.item._content) this.item.type = TcItem.ITEM_TYPES.TEXT.id;
    if (this.item.description && this.urlEntry && this.item.description.trim() === this.urlEntry.trim())
      this.item.description = null;
    return !this.loadingContent && (this.item._content || !this.item._content && this.item.description);
  }

  private createItem() {
    this.itemService.postItem(this.item).subscribe(itemResponse => {
      this.item._id = itemResponse._id;
      this.item.createdAt = itemResponse.createdAt;
      this.item.host = itemResponse.host;
      if (itemResponse._content)
        this.item._content._id = itemResponse._content._id;
      this.itemCreated = true;
      this.newItem.emit({
        value: this.item
      });
      this.initCreateMode();
    });
  }

  private updateItem() {
    this.itemService.putItem(this.item).subscribe(itemResponse => {
      this.item.updatedAt = itemResponse.updatedAt;
      this.newItem.emit({
        value: this.item
      });
    });
  }

  public cancelUpdate() {
    this.updateCanceled.emit({});
  }
}
