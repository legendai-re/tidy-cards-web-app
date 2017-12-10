import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcCollectionModule } from '../tc-collection/tc-collection.module';
import { TcSearchModule }     from '../tc-search/tc-search.module';

import { TcHeaderComponent }  from './tc-header.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule, TcCollectionModule, TcSearchModule ],
  declarations: [
    TcHeaderComponent
  ],
  exports: [
    TcHeaderComponent
  ],
  providers: []
})
export class TcHeaderModule { }
