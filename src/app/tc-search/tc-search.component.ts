import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { URLSearchParams  }     from '@angular/http';
import { TcHeaderService }      from '../tc-header/tc-header.service';

@Component({
    templateUrl: './tc-search.component.html'
})

export class TcSearchComponent implements OnInit, OnDestroy {

    private sub: any;

    constructor(
        public route: ActivatedRoute,
        public headerService: TcHeaderService) {
    }

    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            if(params['q']){
                this.headerService.emitUpdateHeaderEvent({value: {type: 'SEARCH', searchQuery: params['q']}})
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}
