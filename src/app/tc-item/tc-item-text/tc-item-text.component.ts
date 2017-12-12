import { Component, Input, OnInit } from '@angular/core';
import { TcItem } from '../tc-item.class';
import { TcApiUrl } from '../../tc-shared/tc-api-url';

@Component({
    selector: 'tc-item-text',
    templateUrl: 'tc-item-text.component.html',
    styleUrls: ['../tc-item.component.scss', 'tc-item-text.component.scss']
})

export class TcItemTextComponent implements OnInit{

	@Input() item: TcItem;

    public getImageProxyUrl = TcApiUrl.getImageProxyUrl;

    constructor() {
    }

    ngOnInit() {
    }

}
