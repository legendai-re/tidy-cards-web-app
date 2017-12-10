import { Component, Input, OnInit } from '@angular/core';
import { TcItemImage } from './tc-item-image.class';
import { TcItem } from '../tc-item.class';
import { TcApiUrl }  from '../../tc-shared/tc-api-url';

@Component({
    selector: 'tc-item-image',
    templateUrl: 'tc-item-image.component.html',
    styleUrls: ['../tc-item.component.scss', 'tc-item-image.component.scss']
})

export class TcItemImageComponent implements OnInit {

	@Input() item: TcItem;

    public itemImage: TcItemImage;
    public getImageProxyUrl = TcApiUrl.getImageProxyUrl;
    
    constructor() {
    }

    ngOnInit() {
        this.itemImage = this.item._content;
    }

}
