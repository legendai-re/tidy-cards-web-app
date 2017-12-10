import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';

import { TcPaymentComponent }   from './tc-payment.component';

@NgModule({
    imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule ],
    declarations: [
        TcPaymentComponent,
    ],
    exports: [
        TcPaymentComponent,
    ],
    providers: []
})

export class TcPaymentModule { }
