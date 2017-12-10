import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';

import { TcFooterComponent }       from './tc-footer.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule ],
  declarations: [
    TcFooterComponent
  ],
  exports: [
    TcFooterComponent
  ],
  providers: []
})
export class TcFooterModule { }
