import { Component } from '@angular/core';
import { TcLanguageService } from '../../tc-language/tc-language.service';

@Component({
    templateUrl: './tc-terms.component.html',
    styleUrls: ['../tc-page.component.scss','./tc-terms.component.scss']
})
export class TcTermsComponent{

    constructor(public t: TcLanguageService) {
    }
}
