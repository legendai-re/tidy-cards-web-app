import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { TcSortableDirective } from './tc-sortable.directive';
import { TcTruncatePipe }     from '../tc-shared/tc-truncate.pipe';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [
    TcSortableDirective,
    TcTruncatePipe
  ],
  exports: [
    TcSortableDirective,
    TcTruncatePipe
  ],
  providers: []
})

export class TcSharedModule { }
