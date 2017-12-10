import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { TcItemTweet } from './tc-item-tweet.class';
import { TcItem } from '../tc-item.class';

@Component({
    selector: 'tc-item-tweet',
    templateUrl: 'tc-item-tweet.component.html',
    styleUrls: ['../tc-item.component.scss', 'tc-item-tweet.component.scss']
})

export class TcItemTweetComponent implements OnInit, AfterViewInit {

	@Input() item: TcItem;

    public itemTweet: TcItemTweet;

    constructor() {
    }

    ngOnInit() {
        this.itemTweet = this.item._content;
    }

    ngAfterViewInit(){
        window.document.getElementById('render_tweet').click();
    }
}
