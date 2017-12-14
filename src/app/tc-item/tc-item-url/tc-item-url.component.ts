import {Component, Input, OnInit} from '@angular/core';
import {TcItemUrl} from './tc-item-url.class';
import {TcItem} from '../tc-item.class';
import {TcApiUrl} from '../../tc-shared/tc-api-url';

@Component({
  selector: 'tc-item-url',
  templateUrl: 'tc-item-url.component.html',
  styleUrls: ['../tc-item.component.scss', 'tc-item-url.component.scss']
})

export class TcItemUrlComponent implements OnInit {

  @Input() item: TcItem;

  public itemUrl: TcItemUrl;
  public getImageProxyUrl = TcApiUrl.getImageProxyUrl;

  constructor() {
  }

  ngOnInit() {
    this.itemUrl = this.item._content;
  }

}
