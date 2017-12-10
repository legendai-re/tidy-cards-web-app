import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';

import { TcSortableDirective } from './tc-sortable.directive';
import { TcTruncatePipe }     from '../tc-shared/tc-truncate.pipe';
import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';

@NgModule({
  imports: [ CommonModule, FormsModule ],
  declarations: [
    TcSortableDirective,
    FileSelectDirective,
    FileDropDirective,
    TcTruncatePipe
  ],
  exports: [
    TcSortableDirective,
    FileSelectDirective,
    FileDropDirective,
    TcTruncatePipe
  ],
  providers: []
})

export class TcSharedModule { }
