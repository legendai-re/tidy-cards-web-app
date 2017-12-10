import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcCollectionModule } from '../tc-collection/tc-collection.module';
import { TcCollectionCardModule } from '../tc-collection/tc-collection-card/tc-collection-card.module';

import { TcUserComponent }         from './tc-user.component';
import { TcConfirmEmailComponent } from './tc-confirm-email/tc-confirm-email.component';
import { TcUserPrivateComponent }  from './tc-user-private/tc-user-private.component';
import { TcUserPublicComponent }   from './tc-user-public/tc-user-public.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule, TcCollectionModule, TcCollectionCardModule ],
  declarations: [
    TcUserComponent,
    TcConfirmEmailComponent,
    TcUserPrivateComponent,
    TcUserPublicComponent,
  ],
  exports: [
    TcUserComponent,
    TcConfirmEmailComponent
  ],
  providers: []
})
export class TcUserModule { }
