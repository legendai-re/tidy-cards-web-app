import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { NgbModule }          from '@ng-bootstrap/ng-bootstrap';

import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcItemModule }       from '../tc-item/tc-item.module';
import { TcCollectionCardModule } from './tc-collection-card/tc-collection-card.module';
import { TcCollectionCreateModule } from './tc-collection-create/tc-collection-create.module';

import { TcCollectionUserAllComponent }  from './tc-collection-user-all/tc-collection-user-all.component';
import { TcCollectionUserStarredComponent }  from './tc-collection-user-starred/tc-collection-user-starred.component';
import { TcCollectionDetailComponent }   from './tc-collection-detail/tc-collection-detail.component';
import { TcCollectionFeaturedComponent } from './tc-collection-featured/tc-collection-featured.component';
import { TcCollectionLastComponent }     from './tc-collection-last/tc-collection-last.component';
import { TcCollectionPopularComponent }  from './tc-collection-popular/tc-collection-popular.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, TcSharedModule, TcItemModule, TcCollectionCardModule, TcCollectionCreateModule, NgbModule ],
  declarations: [
    TcCollectionUserAllComponent,
    TcCollectionUserStarredComponent,
    TcCollectionDetailComponent,
    TcCollectionFeaturedComponent,
    TcCollectionLastComponent,
    TcCollectionPopularComponent
  ],
  exports: [
    TcCollectionUserAllComponent,
    TcCollectionUserStarredComponent,
    TcCollectionDetailComponent,
    TcCollectionFeaturedComponent,
    TcCollectionLastComponent,
    TcCollectionPopularComponent
  ],
  providers: []
})
export class TcCollectionModule { }
