import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { MarkdownModule }     from 'angular2-markdown';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcPaymentModule }    from '../tc-payment/tc-payment.module';

import { TcAboutComponent }   from './tc-about/tc-about.component';
import { TcContactComponent } from './tc-contact/tc-contact.component';
import { TcTeamComponent }    from './tc-team/tc-team.component';
import { TcTermsComponent }   from './tc-terms/tc-terms.component';
import { TcPrivacyComponent }   from './tc-privacy/tc-privacy.component';


@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule, TcPaymentModule, MarkdownModule],
  declarations: [
    TcAboutComponent,
    TcContactComponent,
    TcTeamComponent,
    TcTermsComponent,
    TcPrivacyComponent
  ],
  exports: [
    TcAboutComponent,
    TcContactComponent,
    TcTeamComponent,
    TcTermsComponent,
    TcPrivacyComponent
  ],
  providers: []
})
export class TcPageModule { }
