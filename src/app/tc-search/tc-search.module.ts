import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcCollectionModule } from '../tc-collection/tc-collection.module';
import { TcCollectionCardModule } from '../tc-collection/tc-collection-card/tc-collection-card.module';

import { TcSearchComponent }       from './tc-search.component';
import { TcSearchHeaderComponent } from './tc-search-header.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule, TcCollectionModule, TcCollectionCardModule ],
  declarations: [
    TcSearchComponent,
    TcSearchHeaderComponent
  ],
  exports: [
    TcSearchComponent,
    TcSearchHeaderComponent
  ],
  providers: []
})
export class TcSearchModule { }
