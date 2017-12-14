import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TcSharedModule } from '../tc-shared/tc-shared.module';

import { TcAuthComponent } from './tc-auth.component';
import { TcSigninComponent } from './tc-signin/tc-signin.component';
import { TcSignupComponent } from './tc-signup/tc-signup.component';
import { TcSocialsComponent } from './tc-socials/tc-socials.component';
import { TcLogoutComponent } from './tc-logout/tc-logout.component';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule ],
    declarations: [
        TcAuthComponent,
        TcSigninComponent,
        TcSignupComponent,
        TcSocialsComponent,
        TcLogoutComponent
    ],
    exports: [
        TcAuthComponent,
        TcSigninComponent,
        TcSignupComponent,
        TcSocialsComponent,
        TcLogoutComponent
    ],
    providers: []
})
export class TcAuthModule { }
