import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { FormsModule }        from '@angular/forms';
import { RouterModule }       from '@angular/router';
import { NgbModule }          from '@ng-bootstrap/ng-bootstrap';
import { MarkdownModule }     from 'angular2-markdown';
import { TcSharedModule }     from '../tc-shared/tc-shared.module';
import { TcCollectionCardModule } from '../tc-collection/tc-collection-card/tc-collection-card.module';
import { TcCollectionCreateModule } from '../tc-collection/tc-collection-create/tc-collection-create.module';

import { TcItemUrlComponent }     from './tc-item-url/tc-item-url.component';
import { TcItemImageComponent }   from './tc-item-image/tc-item-image.component';
import { TcItemTweetComponent }   from './tc-item-tweet/tc-item-tweet.component';
import { TcItemYoutubeComponent } from './tc-item-youtube/tc-item-youtube.component';
import { TcItemCollectionComponent } from './tc-item-collection/tc-item-collection.component';
import { TcItemComponent }        from './tc-item.component';
import { TcItemCreateComponent }  from './tc-item-create/tc-item-create.component';

@NgModule({
  imports: [ RouterModule, CommonModule, FormsModule, MarkdownModule, NgbModule, TcSharedModule, TcCollectionCardModule, TcCollectionCreateModule ],
  declarations: [
    TcItemUrlComponent,
    TcItemImageComponent,
    TcItemTweetComponent,
    TcItemYoutubeComponent,
    TcItemCollectionComponent,
    TcItemComponent,
    TcItemCreateComponent
  ],
  exports: [
    TcItemComponent,
    TcItemCreateComponent
  ],
  providers: []
})
export class TcItemModule { }
