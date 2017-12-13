import { Component, ElementRef, HostListener, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { TcLanguageService } from '../tc-language/tc-language.service';
import { TcItem } from './tc-item.class';
import { TcItemService } from './tc-item.service';

@Component({
    selector: 'tc-item',
    templateUrl: 'tc-item.component.html',
    styleUrls: ['tc-item.component.scss']
 })

export class TcItemComponent implements OnInit{

    public itemTypes: any;
    public intentToUpdate: boolean;
    public itemUpdateModal: NgbModalRef;
    public collectionUpdateModal: NgbModalRef;
    public isUpdatingDisplayMode: boolean;

    @ViewChild("updateItemModal") updateItemModal: ElementRef;
    @ViewChild("updateColletionModal") updateColletionModal: ElementRef;
    @Input() item: TcItem;
    @Input() isAuthor: boolean;
    @Output() deletedItem = new EventEmitter();

    constructor(private t: TcLanguageService, private itemService: TcItemService, private modalService: NgbModal,) {
        this.itemTypes = TcItem.ITEM_TYPES;
    }

    ngOnInit(){
        this.intentToUpdate = false;
    }

    public collapse(){
        this.item.isCollapsed = !this.item.isCollapsed;
    }

    public openUpdateModal(sizeParam = null){
        if (this.item.type == this.itemTypes.COLLECTION)
            this.collectionUpdateModal = this.modalService.open(this.updateItemModal);
        else
            this.itemUpdateModal = this.modalService.open(this.updateItemModal, {
              size: sizeParam
            });
    }

    public openDeleteItemModal(content) {
        this.modalService.open(content).result.then((result) => {
            if(result == 'confirm')
                this.deleteItem();
        }, (reason) => {
        });
    }

    public onItemUpdatedCanceled(){
        if (this.item.type == this.itemTypes.COLLECTION)
            this.collectionUpdateModal.close();
        else
            this.itemUpdateModal.close();
    }

    public updateItemDisplayMode(displayMode){
        if(this.isUpdatingDisplayMode)
            return;
        this.isUpdatingDisplayMode = true;
        this.item.displayMode = displayMode;
        this.itemService.putItem(this.item).subscribe(itemResponse => {
            this.item.updatedAt = itemResponse.updatedAt;
            this.isUpdatingDisplayMode = false;
        })
    }

    public deleteItem(){
        this.itemService.deleteItem(this.item._id).subscribe((e) => {
            this.deletedItem.emit({
                value: this.item
            });
        });
    }

    public onItemUpdated(event){
        if(event.value){
            this.item = event.value;
            this.intentToUpdate = false;
            this.itemUpdateModal.close();
        }
    }

    public onSubCollectionUpdated(event){
        if(event.value){
            this.item._content = event.value;
            this.intentToUpdate = false;
            this.collectionUpdateModal.close();
        }
    }
}
