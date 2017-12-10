import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { TcSharedModule }     from '../../tc-shared/tc-shared.module';

import { TcCollectionCardComponent }     from './tc-collection-card.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule ],
  declarations: [
    TcCollectionCardComponent
  ],
  exports: [
    TcCollectionCardComponent
  ],
  providers: []
})
export class TcCollectionCardModule { }
