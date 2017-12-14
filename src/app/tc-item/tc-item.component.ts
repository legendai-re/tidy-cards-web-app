import {Component, ElementRef, OnInit, Input, Output, EventEmitter, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {TcLanguageService} from '../tc-language/tc-language.service';
import {TcItem} from './tc-item.class';
import {TcItemService} from './tc-item.service';
import index from '@angular/cli/lib/cli';

@Component({
  selector: 'tc-item',
  templateUrl: 'tc-item.component.html',
  styleUrls: ['tc-item.component.scss']
})

export class TcItemComponent implements OnInit {

  public itemTypes: any;
  public intentToUpdate: boolean;
  public itemUpdateModal: NgbModalRef;
  public collectionUpdateModal: NgbModalRef;
  public isUpdatingDisplayMode: boolean;
  public availableDisplayModes: string[];

  @ViewChild('updateItemModal') updateItemModal: ElementRef;
  @ViewChild('updateColletionModal') updateColletionModal: ElementRef;
  @Input() item: TcItem;
  @Input() isAuthor: boolean;
  @Output() deletedItem = new EventEmitter();

  constructor(public t: TcLanguageService, private itemService: TcItemService, private modalService: NgbModal) {
    this.itemTypes = TcItem.ITEM_TYPES;
  }

  ngOnInit() {
    this.intentToUpdate = false;
    this.availableDisplayModes = TcItem.ITEM_TYPES[this.item.type].available_display_modes;
  }

  public openUpdateModal(sizeParam = null) {
    if (this.item.type === this.itemTypes.COLLECTION.id)
      this.collectionUpdateModal = this.modalService.open(this.updateItemModal);
    else
      this.itemUpdateModal = this.modalService.open(this.updateItemModal, {
        size: sizeParam
      });
  }

  public openDeleteItemModal(content) {
    this.modalService.open(content).result.then((result) => {
      if (result === 'confirm')
        this.deleteItem();
    }, () => {
    });
  }

  public onItemUpdatedCanceled() {
    if (this.item.type === this.itemTypes.COLLECTION.id)
      this.collectionUpdateModal.close();
    else
      this.itemUpdateModal.close();
  }

  public updateItemDisplayMode() {
    if (this.isUpdatingDisplayMode)
      return;

    const indexOfCurrentDisplay = this.availableDisplayModes.indexOf(this.item.displayMode);
    let newDisplayMode = '';

    if (indexOfCurrentDisplay >= this.availableDisplayModes.length - 1)
      newDisplayMode = this.availableDisplayModes[0];
    else {
      newDisplayMode = this.availableDisplayModes[indexOfCurrentDisplay + 1];
    }

    this.item.displayMode = newDisplayMode;

    if (!this.isAuthor)
      return;

    this.isUpdatingDisplayMode = true;
    this.itemService.putItem(this.item).subscribe(itemResponse => {
      this.item.updatedAt = itemResponse.updatedAt;
      this.isUpdatingDisplayMode = false;
    });
  }

  public deleteItem() {
    this.itemService.deleteItem(this.item._id).subscribe(() => {
      this.deletedItem.emit({
        value: this.item
      });
    });
  }

  public onItemUpdated(event) {
    if (event.value) {
      this.item = event.value;
      this.intentToUpdate = false;
      this.itemUpdateModal.close();
    }
  }

  public onSubCollectionUpdated(event) {
    if (event.value) {
      this.item._content = event.value;
      this.intentToUpdate = false;
      this.collectionUpdateModal.close();
    }
  }
}
