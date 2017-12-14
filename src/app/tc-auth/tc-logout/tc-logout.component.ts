import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TcAuthService } from '../tc-auth.service';

@Component({
    template: ''
})

export class TcLogoutComponent {

    constructor(public authService: TcAuthService, public router: Router) {
        this.authService.logout();
    }

}
