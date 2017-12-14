import { Component } from '@angular/core';
import { Http } from '@angular/http';

@Component({
    templateUrl: './tc-admin-home.component.html',
    styleUrls: ['./tc-admin-home.component.scss']
})

export class TcAdminHomeComponent {

    constructor (private http: Http) {
    }

}
