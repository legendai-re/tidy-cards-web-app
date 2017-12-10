import { Component } from '@angular/core';

import { TcCollectionCreateComponent } from './tc-collection-create.component'

@Component({
  selector: 'tc-collection-update',
  templateUrl: './tc-collection-update.component.html',
  styleUrls: ['../tc-collection-card/tc-collection-card.component.scss', 'tc-collection-update.component.scss']
})
export class TcCollectionUpdateComponent extends TcCollectionCreateComponent {
}