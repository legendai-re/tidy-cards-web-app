import { Component, OnInit } from '@angular/core';
import { Title }             from '@angular/platform-browser';
import { TcLanguageService } from '../../tc-language/tc-language.service';
import { TcHeaderService }   from '../../tc-header/tc-header.service';

@Component({
    templateUrl: './tc-about.component.html',
    styleUrls: ['../tc-page.component.scss','./tc-about.component.scss']
})
export class TcAboutComponent implements OnInit{

    constructor(
        public t: TcLanguageService,
        public headerService: TcHeaderService,
        public titleService: Title) {

        this.t.getLangInitializedEmitter().subscribe((value) => {
            this.titleService.setTitle(this.t._.page.about.title + ' | TidyCards');
        })
    }

    ngOnInit() {
        if(this.t.langInitialized)
            this.titleService.setTitle(this.t._.page.about.title + ' | TidyCards');
    	this.emitUpdateHeaderEvent();
    	setTimeout( () => {
            $("#pageHeadings").removeClass('is-hidden');
            $("#pageContent").removeClass('is-hidden');
        }, 10);
    }

    private emitUpdateHeaderEvent(){
        this.headerService.emitUpdateHeaderEvent({
            value:{
                type: 'page'
            }
        });
    }
}
